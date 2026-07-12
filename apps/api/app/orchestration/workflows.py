from datetime import timedelta

from temporalio import workflow
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    from app.orchestration.activities import InfrastructureActivities
    from app.orchestration.models import (
        InfrastructureProbeInput,
        InfrastructureProbeResult,
    )


@workflow.defn(name="flowgraph.infrastructure-probe")
class InfrastructureProbeWorkflow:
    @workflow.run
    async def run(
        self, request: InfrastructureProbeInput
    ) -> InfrastructureProbeResult:
        return await workflow.execute_activity(
            InfrastructureActivities.redis_cache_roundtrip,
            request,
            start_to_close_timeout=timedelta(seconds=5),
            retry_policy=RetryPolicy(
                initial_interval=timedelta(seconds=1),
                backoff_coefficient=2,
                maximum_interval=timedelta(seconds=5),
                maximum_attempts=3,
            ),
        )
