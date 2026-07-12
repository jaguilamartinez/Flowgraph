from dataclasses import dataclass


@dataclass
class InfrastructureProbeInput:
    request_id: str


@dataclass
class InfrastructureProbeResult:
    request_id: str
    redis_cache_roundtrip: bool
