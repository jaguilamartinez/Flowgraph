import asyncio
from contextlib import asynccontextmanager
from dataclasses import asdict
from datetime import datetime, timedelta, timezone
import json
import logging
import os
from pathlib import Path
import shutil
import time
from typing import Any, AsyncIterator
import uuid

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.infrastructure.services import InfrastructureServices
from app.orchestration.models import InfrastructureProbeInput
from app.orchestration.workflows import InfrastructureProbeWorkflow


logger = logging.getLogger(__name__)
legacy_project_parameters: dict[str, Any] = {}


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    settings.jobs_root.mkdir(parents=True, exist_ok=True)
    services = InfrastructureServices.from_settings(settings)
    application.state.settings = settings
    application.state.services = services
    try:
        yield
    finally:
        await services.close()


app = FastAPI(
    title="Flowgraph AI Development API",
    version="0.2.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8182"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_application_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_services(request: Request) -> InfrastructureServices:
    return request.app.state.services


def read_status(job_dir: Path) -> dict[str, Any]:
    status_file = job_dir / "status.json"
    if not status_file.exists():
        raise HTTPException(status_code=404, detail="Run not found")
    return json.loads(status_file.read_text())


class RunRequest(BaseModel):
    """Job input for the transitional development runner."""

    project_parameters: dict[str, Any] = Field(default_factory=dict)
    main_script: str = Field(
        default=(
            "import KratosMultiphysics\n"
            "print('KratosMultiphysics import succeeded')\n"
            "print('Development import check only; no simulation was started.')\n"
        ),
        description=(
            "Development-only Python source executed by the transitional runner. "
            "Never accept this value from an untrusted caller."
        ),
    )


@app.get("/health")
@app.get("/health/live")
async def health_live() -> dict[str, str]:
    """Report process liveness without probing downstream services."""
    return {"status": "ok"}


@app.get("/health/ready")
async def health_ready(request: Request) -> JSONResponse:
    """Report whether the API can reach its required infrastructure."""
    settings = get_application_settings(request)
    services = get_services(request)
    redis_result, temporal_result = await asyncio.gather(
        services.cache.ping(),
        services.temporal.check_health(),
        return_exceptions=True,
    )

    checks: dict[str, dict[str, str]] = {}
    for name, result in (
        ("redis", redis_result),
        ("temporal", temporal_result),
    ):
        if result is True:
            checks[name] = {"status": "ok"}
        else:
            checks[name] = {"status": "unavailable"}
            if isinstance(result, BaseException):
                logger.warning(
                    "Readiness check failed dependency=%s error_type=%s",
                    name,
                    type(result).__name__,
                )

    jobs_root_ready = (
        settings.jobs_root.is_dir()
        and os.access(settings.jobs_root, os.R_OK)
        and os.access(settings.jobs_root, os.W_OK)
    )
    checks["jobs_root"] = {"status": "ok" if jobs_root_ready else "unavailable"}

    ready = all(check["status"] == "ok" for check in checks.values())
    return JSONResponse(
        status_code=200 if ready else 503,
        content={"status": "ready" if ready else "not_ready", "checks": checks},
    )


@app.post("/api/v1/development/workflows/smoke")
async def workflow_smoke(request: Request) -> dict[str, Any]:
    """Run the local Temporal and Redis infrastructure probe."""
    settings = get_application_settings(request)
    if not settings.enable_development_endpoints:
        raise HTTPException(status_code=404, detail="Not found")

    services = get_services(request)
    request_id = str(uuid.uuid4())
    workflow_id = f"development-probe-{request_id}"
    try:
        client = await services.temporal.get_client()
        handle = await client.start_workflow(
            InfrastructureProbeWorkflow.run,
            InfrastructureProbeInput(request_id=request_id),
            id=workflow_id,
            task_queue=settings.temporal_task_queue,
            execution_timeout=timedelta(seconds=30),
        )
        result = await asyncio.wait_for(handle.result(), timeout=20)
    except TimeoutError as error:
        raise HTTPException(
            status_code=504,
            detail="Temporal workflow worker did not complete the probe in time",
        ) from error
    except Exception as error:
        logger.warning(
            "Development workflow probe failed error_type=%s",
            type(error).__name__,
        )
        raise HTTPException(
            status_code=503,
            detail="Temporal workflow probe is unavailable",
        ) from error

    return {"workflow_id": workflow_id, **asdict(result)}


@app.post("/api/runs", status_code=202)
def create_run(run_request: RunRequest, request: Request) -> dict[str, Any]:
    """Queue a job for the development runner.

    This endpoint accepts Python source and must not be exposed to untrusted
    clients.
    """
    return enqueue_run(run_request, get_application_settings(request).jobs_root)


def enqueue_run(run_request: RunRequest, jobs_root: Path) -> dict[str, Any]:
    job_id = str(uuid.uuid4())
    staging = jobs_root / f".{job_id}.staging"
    job_dir = jobs_root / job_id
    staging.mkdir(parents=True)
    (staging / "ProjectParameters.json").write_text(
        json.dumps(run_request.project_parameters, indent=2)
    )
    (staging / "MainKratos.py").write_text(run_request.main_script)
    status = {"id": job_id, "state": "queued", "created_at": utc_now()}
    (staging / "status.json").write_text(json.dumps(status, indent=2))
    staging.rename(job_dir)
    return status


@app.get("/api/runs/{job_id}")
def get_run(job_id: uuid.UUID, request: Request) -> dict[str, Any]:
    job_dir = get_application_settings(request).jobs_root / str(job_id)
    status = read_status(job_dir)
    log_file = job_dir / "runner.log"
    status["log"] = log_file.read_text(errors="replace") if log_file.exists() else ""
    return status


@app.delete("/api/runs/{job_id}", status_code=204)
def delete_run(job_id: uuid.UUID, request: Request) -> None:
    job_dir = get_application_settings(request).jobs_root / str(job_id)
    if not job_dir.exists():
        raise HTTPException(status_code=404, detail="Run not found")
    shutil.rmtree(job_dir)


@app.post("/upload_json", status_code=204, include_in_schema=False)
def legacy_upload(project_parameters: dict[str, Any]) -> None:
    """Receive parameters from the legacy Flowgraph Run Problem node."""
    global legacy_project_parameters
    legacy_project_parameters = project_parameters


@app.get("/run_simulation", include_in_schema=False)
def legacy_run(request: Request) -> StreamingResponse:
    """Queue the latest legacy upload and stream its runner log."""
    jobs_root = get_application_settings(request).jobs_root
    status = enqueue_run(
        RunRequest(project_parameters=legacy_project_parameters),
        jobs_root,
    )
    job_dir = jobs_root / status["id"]

    def stream():
        offset = 0
        while True:
            log_file = job_dir / "runner.log"
            if log_file.exists():
                content = log_file.read_text(errors="replace")
                if len(content) > offset:
                    yield content[offset:]
                    offset = len(content)
            current = read_status(job_dir)
            if current["state"] in {"completed", "failed"}:
                if current["state"] == "failed":
                    yield (
                        "\nKratos runner failed with exit code "
                        f"{current.get('exit_code')}.\n"
                    )
                break
            time.sleep(0.25)

    return StreamingResponse(stream(), media_type="text/plain")
