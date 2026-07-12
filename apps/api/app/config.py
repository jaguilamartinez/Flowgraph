from functools import lru_cache
from pathlib import Path
import re

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


SAFE_NAME = re.compile(r"^[A-Za-z0-9._-]+$")
SAFE_PREFIX = re.compile(r"^[A-Za-z0-9:._-]+$")


class Settings(BaseSettings):
    """Process configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_environment: str = "development"
    enable_development_endpoints: bool = True
    jobs_root: Path = Path("/workspace/jobs")

    redis_url: str = "redis://localhost:6379/0"
    redis_key_prefix: str = "flowgraph:dev"
    redis_connect_timeout_seconds: float = Field(default=1.0, gt=0, le=30)
    redis_operation_timeout_seconds: float = Field(default=2.0, gt=0, le=30)
    redis_max_connections: int = Field(default=20, ge=1, le=500)
    redis_default_ttl_seconds: int = Field(default=300, ge=1, le=86400)

    temporal_address: str = "localhost:7233"
    temporal_namespace: str = "flowgraph-ai"
    temporal_task_queue: str = "platform-workflows"
    temporal_connect_timeout_seconds: float = Field(default=5.0, gt=0, le=60)
    dependency_health_timeout_seconds: float = Field(default=2.0, gt=0, le=30)

    @field_validator("redis_key_prefix")
    @classmethod
    def validate_redis_key_prefix(cls, value: str) -> str:
        if not SAFE_PREFIX.fullmatch(value):
            raise ValueError("must contain only letters, numbers, ':', '.', '_' or '-'")
        return value

    @field_validator("app_environment", "temporal_namespace", "temporal_task_queue")
    @classmethod
    def validate_safe_name(cls, value: str) -> str:
        if not SAFE_NAME.fullmatch(value):
            raise ValueError("must contain only letters, numbers, '.', '_' or '-'")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
