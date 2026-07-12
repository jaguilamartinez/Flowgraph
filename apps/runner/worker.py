import json
import os
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

JOBS_ROOT = Path(os.getenv("JOBS_ROOT", "/workspace/jobs"))
POLL_SECONDS = float(os.getenv("POLL_SECONDS", "1"))


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_status(job_dir: Path, status: dict) -> None:
    temporary = job_dir / "status.json.tmp"
    temporary.write_text(json.dumps(status, indent=2))
    temporary.replace(job_dir / "status.json")


def run(job_dir: Path, status: dict) -> None:
    status.update(state="running", started_at=utc_now())
    write_status(job_dir, status)
    with (job_dir / "runner.log").open("w") as log:
        result = subprocess.run(
            ["python3", "MainKratos.py"],
            cwd=job_dir,
            stdout=log,
            stderr=subprocess.STDOUT,
            check=False,
        )
    status.update(
        state="completed" if result.returncode == 0 else "failed",
        exit_code=result.returncode,
        finished_at=utc_now(),
    )
    write_status(job_dir, status)


def main() -> None:
    JOBS_ROOT.mkdir(parents=True, exist_ok=True)
    print(f"Kratos runner started jobs_root={JOBS_ROOT}", flush=True)
    while True:
        for status_file in sorted(JOBS_ROOT.glob("*/status.json")):
            try:
                status = json.loads(status_file.read_text())
                if status.get("state") == "queued":
                    run(status_file.parent, status)
            except Exception as error:
                print(
                    "Kratos job processing failed "
                    f"status_file={status_file} "
                    f"error_type={type(error).__name__} error={error}",
                    flush=True,
                )
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    main()
