import json
import re
from typing import Any

from redis.asyncio import Redis

from app.config import Settings


SAFE_KEY_SEGMENT = re.compile(r"^[A-Za-z0-9._-]+$")


class RedisCache:
    """JSON cache whose keys are tenant scoped and whose writes always expire.

    Cached values are disposable and must not be used as authoritative product
    or workflow state.
    """

    def __init__(self, client: Redis, key_prefix: str, default_ttl_seconds: int):
        self._client = client
        self._key_prefix = key_prefix
        self._default_ttl_seconds = default_ttl_seconds

    @classmethod
    def from_settings(cls, settings: Settings) -> "RedisCache":
        client = Redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
            socket_connect_timeout=settings.redis_connect_timeout_seconds,
            socket_timeout=settings.redis_operation_timeout_seconds,
            health_check_interval=30,
            max_connections=settings.redis_max_connections,
            retry_on_timeout=True,
        )
        return cls(
            client=client,
            key_prefix=settings.redis_key_prefix,
            default_ttl_seconds=settings.redis_default_ttl_seconds,
        )

    def key(self, *, tenant_id: str, namespace: str, identifier: str) -> str:
        segments = (tenant_id, namespace, identifier)
        if any(not SAFE_KEY_SEGMENT.fullmatch(segment) for segment in segments):
            raise ValueError(
                "Redis key segments may contain only letters, numbers, '.', '_' or '-'"
            )
        return f"{self._key_prefix}:{tenant_id}:{namespace}:{identifier}"

    async def ping(self) -> bool:
        return bool(await self._client.ping())

    async def get_json(self, key: str) -> Any | None:
        value = await self._client.get(key)
        return None if value is None else json.loads(value)

    async def set_json(
        self,
        key: str,
        value: Any,
        *,
        ttl_seconds: int | None = None,
    ) -> None:
        ttl = self._default_ttl_seconds if ttl_seconds is None else ttl_seconds
        if ttl <= 0:
            raise ValueError("Redis cache writes require a positive TTL")
        encoded = json.dumps(value, separators=(",", ":"), sort_keys=True)
        await self._client.set(key, encoded, ex=ttl)

    async def delete(self, key: str) -> None:
        await self._client.delete(key)

    async def close(self) -> None:
        await self._client.aclose()
