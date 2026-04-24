# Contributing to Audit Trail

Thanks for wanting to contribute. Audit Trail is a monorepo to receive, store, and query audit events and request logs from external services. The backend uses NestJS, TypeORM, and PostgreSQL with a DDD/hexagonal architecture; the frontend uses Next.js and React to explore the stored data.

The most valuable contribution is not throwing code in blindly: it is understanding the problem, proposing a small, verifiable fix, and leaving the system better than you found it.

## Ways to contribute

- Report bugs with reproducible steps.
- Suggest product or architecture improvements.
- Improve documentation, examples, and the installation experience.
- Add tests or cover edge cases.
- Implement features agreed on in an issue.

## Before opening a pull request

1. Check whether a related issue or PR already exists.
2. If the change is non-trivial, open an issue first and explain the problem.
3. Keep scope small. A large, unfocused PR is hard to review.
4. Follow project style: DDD in the backend, domain modules in the frontend, and explicit naming.
5. Add or update tests when you change behavior.
6. Update documentation when you change APIs, commands, environment variables, or usage flows.

## Local setup

Recommended requirements:

- Node.js 22+
- Yarn 1.x
- Docker and Docker Compose
- PostgreSQL 16 if you are not using Docker

```bash
yarn install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up -d postgres
yarn --cwd backend migration:run
```

Run services in development:

```bash
yarn backend:dev
yarn frontend:dev
```

Local URLs:

- Backend API: `http://localhost:5000/v1`
- Swagger: `http://localhost:5000/documentation`
- Frontend: `http://localhost:3000`

## Useful scripts

```bash
yarn backend:test
yarn --cwd backend test --testPathPattern="audit-events"
yarn --cwd backend lint
yarn --cwd frontend type-check
yarn --cwd frontend lint
```

> Note for contributors: you do not need to run a build for documentation-only changes. For code changes, prefer tests, type-check, and lint depending on the area you touch.

## Commit conventions

We use Conventional Commits:

```text
feat: add audit event filters
fix: handle empty request log actor
chore: update contribution docs
docs: document docker deployment
```

Use scopes when they help:

```text
feat(backend): add request log search criteria
fix(frontend): preserve audit filters in URL
```

## Pull requests

A good PR includes:

- What problem it solves.
- What approach you chose and why.
- How you verified it.
- Known risks, tradeoffs, or technical debt.
- Screenshots or examples if the UI or a public API changes.

## Project architecture

- `backend/src/audit-events`: bounded context for audit events.
- `backend/src/request-logs`: bounded context for HTTP logs received from external services.
- `backend/src/shared`: shared infrastructure, persistence, configuration, and building blocks.
- `frontend/src/modules`: frontend domain modules with repositories, hooks, and related UI.

The base rule: the domain should not depend on frameworks. If a solution puts TypeORM, HTTP, or UI details inside the domain model, stop and rethink it.

## Security

Do not post credentials, tokens, database dumps, or personal data in issues or PRs. If you find a vulnerability, follow `SECURITY.md`.

## Code of conduct

All contributions are subject to `CODE_OF_CONDUCT.md`.
