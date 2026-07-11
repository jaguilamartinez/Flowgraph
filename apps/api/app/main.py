import json
import os
import shutil
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

JOBS_ROOT = Path(os.getenv("JOBS_ROOT", "/workspace/jobs"))

app = FastAPI(title="Flowgraph Development API", version="0.1.0")
legacy_project_parameters: dict[str, Any] = {}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8182"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_status(job_dir: Path) -> dict[str, Any]:
    status_file = job_dir / "status.json"
    if not status_file.exists():
        raise HTTPException(status_code=404, detail="Run not found")
    return json.loads(status_file.read_text())


class RunRequest(BaseModel):
    project_parameters: dict[str, Any] = Field(default_factory=dict)
    main_script: str = Field(
        default=(
            "import KratosMultiphysics\n"
            "print('KratosMultiphysics imported successfully')\n"
            "print('Replace main_script with your application entrypoint.')\n"
        ),
        description="Python source executed by the isolated Kratos runner.",
    )


@app.on_event("startup")
def create_jobs_root() -> None:
    JOBS_ROOT.mkdir(parents=True, exist_ok=True)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/runs", status_code=202)
def create_run(request: RunRequest) -> dict[str, Any]:
    return enqueue_run(request)


def enqueue_run(request: RunRequest) -> dict[str, Any]:
    job_id = str(uuid.uuid4())
    staging = JOBS_ROOT / f".{job_id}.staging"
    job_dir = JOBS_ROOT / job_id
    staging.mkdir(parents=True)
    (staging / "ProjectParameters.json").write_text(
        json.dumps(request.project_parameters, indent=2)
    )
    (staging / "MainKratos.py").write_text(request.main_script)
    status = {"id": job_id, "state": "queued", "created_at": utc_now()}
    (staging / "status.json").write_text(json.dumps(status, indent=2))
    staging.rename(job_dir)
    return status


@app.get("/api/runs/{job_id}")
def get_run(job_id: uuid.UUID) -> dict[str, Any]:
    status = read_status(JOBS_ROOT / str(job_id))
    log_file = JOBS_ROOT / str(job_id) / "runner.log"
    status["log"] = log_file.read_text(errors="replace") if log_file.exists() else ""
    return status


@app.delete("/api/runs/{job_id}", status_code=204)
def delete_run(job_id: uuid.UUID) -> None:
    job_dir = JOBS_ROOT / str(job_id)
    if not job_dir.exists():
        raise HTTPException(status_code=404, detail="Run not found")
    shutil.rmtree(job_dir)


@app.post("/upload_json", status_code=204, include_in_schema=False)
def legacy_upload(project_parameters: dict[str, Any]) -> None:
    """Compatibility endpoint for Flowgraph's existing Run Problem node."""
    global legacy_project_parameters
    legacy_project_parameters = project_parameters


@app.get("/run_simulation", include_in_schema=False)
def legacy_run() -> StreamingResponse:
    """Queue the last legacy upload and stream the worker log until completion."""
    status = enqueue_run(RunRequest(project_parameters=legacy_project_parameters))
    job_dir = JOBS_ROOT / status["id"]

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
                    yield f"\nKratos runner failed with exit code {current.get('exit_code')}.\n"
                break
            time.sleep(0.25)

    return StreamingResponse(stream(), media_type="text/plain")
