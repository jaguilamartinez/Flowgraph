# Flowgraph AI

This is a development workspace for a planned simulation-configuration application built around a versioned Flowgraph intermediate representation, a Next.js interface, a FastAPI control plane that interacts with LLMs, and a Kratos execution service. The repository currently provides interface and service scaffolding; the new intermediate representation, language-model integration, compiler, and production execution path are not yet implemented.

The original Express/LiteGraph editor remains available as a compatibility and migration reference under [`apps/flowgraph-legacy`](./apps/flowgraph-legacy/README.md).

## Repository layout

```text
apps/
├── frontend/          Next.js application and shared design system
├── api/               FastAPI control plane and workflow worker
├── runner/            Transitional shared-volume Kratos worker
└── flowgraph-legacy/  Original Flowgraph editor, kept for migration
compose.yaml           Docker Desktop development environment
```

## Start the development environment

Docker Desktop with Docker Compose is the supported local setup.

```console
cp .env.example .env
docker compose up --build
```

Services:

| Service | Default endpoint or role |
|---|---|
| Frontend | <http://localhost:3000> |
| Design-system catalog | <http://localhost:3000/design-system> |
| FastAPI documentation | <http://localhost:8000/docs> |
| Legacy Flowgraph editor | <http://localhost:8182> |
| Temporal Web UI | <http://localhost:8233> |
| Temporal gRPC | `localhost:7233` |
| Redis | `localhost:6379` |
| Temporal workflow worker | Internal worker polling the configured Temporal task queue |
| Kratos runner | Transitional worker polling the shared jobs volume |

Useful commands:

```console
docker compose ps
docker compose logs -f frontend api flowgraph redis temporal workflow-worker runner
docker compose restart frontend api flowgraph redis temporal workflow-worker runner
docker compose down
```

Before starting containers, validate local interpolation without exposing values:

```console
docker compose config --quiet
```

`docker compose down -v` removes all named volumes, including Temporal history, installed frontend packages, the Next.js build cache, and simulation jobs. Use it only when a full local reset is intended.

## Verify Temporal and Redis

FastAPI exposes separate process liveness and dependency readiness endpoints:

```console
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
```

Run the development probe to check the API, Temporal server, workflow worker, and Redis cache together:

```console
curl -X POST http://localhost:8000/api/v1/development/workflows/smoke
```

The probe appears in the Temporal UI at <http://localhost:8233>. Redis is configured as an expiring, disposable cache with no persistence volume. Temporal development history is retained in the `temporal_data` volume.

## Run only the legacy editor

The legacy service keeps its existing Compose service name and port:

```console
docker compose up --build flowgraph
```

To run it directly without Compose:

```console
cd apps/flowgraph-legacy
npm ci
NODE_ENV=docker npm run devstart
```

Bundled import examples are in [`apps/flowgraph-legacy/resources/examples`](./apps/flowgraph-legacy/resources/examples/).

## Frontend reference

The frontend component inventory and usage rules live in [`apps/frontend/design-system`](./apps/frontend/design-system/README.md). The catalog route is a development reference, not a separate application.

## Development boundary

Treat `apps/flowgraph-legacy` as maintenance-only. Changes there should be limited to compatibility, migration fixtures, security, and keeping the reference editor launchable. New Flowgraph IR, validation, compilation, language-model integration, and product UI work belongs in the new application architecture.

## License

See [LICENSE](./LICENSE).
