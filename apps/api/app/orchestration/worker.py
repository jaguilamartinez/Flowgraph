import asyncio
import logging

from temporalio.worker import Worker

from app.config import get_settings
from app.infrastructure.services import InfrastructureServices
from app.orchestration.activities import InfrastructureActivities
from app.orchestration.workflows import InfrastructureProbeWorkflow


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)


async def connect_with_backoff(services: InfrastructureServices):
    delay = 1.0
    while True:
        try:
            return await services.temporal.get_client()
        except Exception as error:
            logger.warning(
                "Temporal connection failed error_type=%s retry_delay_seconds=%.1f",
                type(error).__name__,
                delay,
            )
            await asyncio.sleep(delay)
            delay = min(delay * 2, 15.0)


async def run_worker() -> None:
    settings = get_settings()
    services = InfrastructureServices.from_settings(settings)
    try:
        client = await connect_with_backoff(services)
        activities = InfrastructureActivities(services.cache)
        logger.info(
            "Starting Temporal worker namespace=%s task_queue=%s",
            settings.temporal_namespace,
            settings.temporal_task_queue,
        )
        worker = Worker(
            client,
            task_queue=settings.temporal_task_queue,
            workflows=[InfrastructureProbeWorkflow],
            activities=[activities.redis_cache_roundtrip],
        )
        await worker.run()
    finally:
        await services.close()


if __name__ == "__main__":
    asyncio.run(run_worker())
