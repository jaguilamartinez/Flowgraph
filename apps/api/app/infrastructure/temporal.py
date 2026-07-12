import asyncio
from datetime import timedelta

from temporalio.client import Client

from app.config import Settings


class TemporalClientProvider:
    """Provides one shared Temporal client per process, created on first use."""

    def __init__(self, settings: Settings):
        self._settings = settings
        self._client: Client | None = None
        self._connect_lock = asyncio.Lock()

    async def get_client(self) -> Client:
        if self._client is not None:
            return self._client

        async with self._connect_lock:
            if self._client is None:
                async with asyncio.timeout(
                    self._settings.temporal_connect_timeout_seconds
                ):
                    self._client = await Client.connect(
                        self._settings.temporal_address,
                        namespace=self._settings.temporal_namespace,
                    )
        return self._client

    async def check_health(self) -> bool:
        async with asyncio.timeout(
            self._settings.dependency_health_timeout_seconds
        ):
            client = await self.get_client()
            return await client.service_client.check_health(
                timeout=timedelta(
                    seconds=self._settings.dependency_health_timeout_seconds
                )
            )
