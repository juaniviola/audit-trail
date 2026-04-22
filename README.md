# audit-trail

Monorepo for the Audit Trail service, modeled after the MBItrading DDD layout.

- `backend/` — NestJS 11 + TypeORM + PostgreSQL, structured in bounded contexts (shared kernel, audit events, request logs).
- `frontend/` — Next.js 15 + React 19, same DDD module split (domain / application / infrastructure).

## Quick start

```bash
docker compose up -d postgres

cp backend/.env.example backend/.env
yarn --cwd backend install
yarn --cwd backend migration:run
yarn --cwd backend start:dev

cp frontend/.env.example frontend/.env.local
yarn --cwd frontend install
yarn --cwd frontend dev
```

- Backend API: `http://localhost:5000/v1`
- Swagger: `http://localhost:5000/documentation`
- Frontend: `http://localhost:3000`

## Audit events

Single bounded context: `backend/src/audit-events` (DDD aggregate + use cases + Postgres
repository) and `frontend/src/modules/audit-events` (typed repository + React Query hooks).

The `AuditEvent` aggregate lives in `backend/src/audit-events/domain/audit.event.ts` and
captures `id`, `sourceApp`, `sourceEnv`, `eventName`, `action`, `resourceType`, `resourceId`,
`organizationId`, `actorType` (`user` | `system` | `service` | `api_key`), `actorId`,
`actorLabel`, `requestId`, `correlationId`, `causationId`, `occurredAt`, `ingestedAt`,
`before`, `after`, `changes[]`, `requestContext` and `metadata`. Records are immutable; the
only mutation is `AuditEvent.record(...)` which emits an `audit-events.recorded` domain event
through the in-memory event bus.

`requestContext` is a first-class VO separated from `metadata` so transport-level data
(`ip`, `userAgent`, `method`, `path`, `route`, `origin`, `referer`, `geoCountry`, `geoCity`,
`clientId`, ...) never pollutes the domain metadata bag.

### HTTP API (versioned under `/v1`)

| Method | Path                  | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| POST   | `/audit-events`       | Record a new audit event                     |
| GET    | `/audit-events`       | Search with criteria + pagination            |
| GET    | `/audit-events/:id`   | Fetch full detail (incl. before/after/diff)  |

## Request logs

Complementary bounded context: `backend/src/request-logs`. Centralized intake for transport-
level request logs sent by **external** services (success **and** failure). Paired with
`audit-events` through `correlationId`, it reconstructs "what was attempted" versus "what
actually happened".

> This app does **not** auto-log its own inbound traffic. It is a receiver for external
> emitters — every other service ships its own HTTP-level logs here via
> `POST /v1/request-logs`. Emitters are responsible for redaction, truncation and
> propagating `x-correlation-id` / `x-request-id` headers shared with any `audit-events`
> they emit.

The `RequestLog` aggregate captures `method`, `path`, `route`, `status`, `durationMs`,
`sourceApp`, `sourceEnv`, `actorType` (`user` | `system` | `service` | `api_key` |
`anonymous`), `actorId`, `actorLabel`, `organizationId`, `requestId`, `correlationId`, `ip`,
`userAgent`, `referer`, `origin`, `requestBody`, `responseBody`, `query`, `errorCode`,
`errorMessage`, `occurredAt`, `ingestedAt`. Sensitive fields should already be redacted by
the emitter before POSTing.

### HTTP API

| Method | Path                  | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| POST   | `/request-logs`       | Record a request log (from external services) |
| GET    | `/request-logs`       | Search with criteria + pagination            |
| GET    | `/request-logs/:id`   | Fetch full detail                            |

### Useful scripts

```bash
yarn --cwd backend test                                # full unit suite
yarn --cwd backend test --testPathPattern="audit-events"
yarn --cwd backend lint
yarn --cwd backend migration:generate src/shared/infrastructure/persistence/typeorm/migrations/<Name>
yarn --cwd backend migration:run

yarn --cwd frontend dev
yarn --cwd frontend type-check
yarn --cwd frontend lint
yarn --cwd frontend build
```
