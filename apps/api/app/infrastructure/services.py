from dataclasses import dataclass

from app.config import Settings
from app.infrastructure.redis import RedisCache
from app.infrastructure.temporal import TemporalClientProvider


@dataclass(slots=True)
class InfrastructureServices:
    cache: RedisCache
    temporal: TemporalClientProvider

    @classmethod
    def from_settings(cls, settings: Settings) -> "InfrastructureServices":
        return cls(
            cache=RedisCache.from_settings(settings),
            temporal=TemporalClientProvider(settings),
        )

    async def close(self) -> None:
        await self.cache.close()
