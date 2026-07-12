from temporalio import activity

from app.infrastructure.redis import RedisCache
from app.orchestration.models import (
    InfrastructureProbeInput,
    InfrastructureProbeResult,
)


class InfrastructureActivities:
    def __init__(self, cache: RedisCache):
        self._cache = cache

    @activity.defn(name="flowgraph.infrastructure.redis-cache-roundtrip")
    async def redis_cache_roundtrip(
        self, request: InfrastructureProbeInput
    ) -> InfrastructureProbeResult:
        key = self._cache.key(
            tenant_id="development",
            namespace="workflow-probe",
            identifier=request.request_id,
        )
        value = {"request_id": request.request_id, "status": "ok"}
        await self._cache.set_json(key, value, ttl_seconds=30)
        cached = await self._cache.get_json(key)
        if cached != value:
            raise RuntimeError("Redis cache roundtrip returned an unexpected value")
        await self._cache.delete(key)
        return InfrastructureProbeResult(
            request_id=request.request_id,
            redis_cache_roundtrip=True,
        )
