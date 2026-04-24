# Audit Trail

Centralized audit trail service packaged as a single Docker image containing:

- **Backend**: NestJS API on port `5000`
- **Frontend**: Next.js UI on port `3000`
- **Database**: PostgreSQL, provided externally or through Docker Compose

The frontend calls the backend through the internal same-origin proxy `/api/v1`, which forwards to `INTERNAL_API_URL` inside the container.

---

## ⚠️ Security disclaimer — read this first

This version **does not include authentication or authorization yet**.

That means the API is currently open to whoever can reach it. There is no API key, no bearer token, no RBAC, no tenant-level access control, and no built-in TLS termination.

Security is planned for a future version, but **for now you must not expose this service directly to the public internet**.

Recommended deployment model:

- Run it inside a **private Docker network**, VPC, VPN, or internal Kubernetes namespace.
- Only allow trusted backend services to reach the API.
- Put it behind a private reverse proxy, gateway, firewall, or service mesh if needed.
- Do not publish port `5000` publicly unless you add your own protection layer.
- Remember: **CORS is not security**. CORS only affects browsers; it does not protect the API from direct HTTP clients.

If you need to expose the frontend UI, expose only port `3000` and keep the backend API reachable through internal networking.

---

## Quick start with Docker Compose

Create a `docker-compose.yml` file:

```yaml
services:
  audit-trail:
    image: juaniviola/audit-trail:latest
    container_name: audit-trail-app
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production

      # Internal app ports
      BACKEND_PORT: 5000
      FRONTEND_PORT: 3000
      INTERNAL_API_URL: http://127.0.0.1:5000

      # Database
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_DATABASE: audit_trail
      DB_SSL: 'false'

      # Startup behavior
      WAIT_FOR_DB: 'true'
      RUN_MIGRATIONS: 'true'

      # CORS is not auth. Keep this narrow for browser usage.
      CORS_ORIGINS: http://localhost:3000
    ports:
      # Expose the UI.
      - '3000:3000'

      # Do NOT expose the API publicly by default.
      # If you need local-only API access for development, use:
      # - '127.0.0.1:5000:5000'
    expose:
      # Available only to other containers on this Docker network.
      - '5000'

  postgres:
    image: postgres:16-alpine
    container_name: audit-trail-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: audit_trail
    volumes:
      - audit_trail_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres -d audit_trail']
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  audit_trail_pg_data:
```

Start it:

```bash
docker compose up -d
```

Open the UI:

```text
http://localhost:3000
```

Backend API inside the Docker network:

```text
http://audit-trail:5000/v1
```

Swagger documentation, if the backend port is reachable from your network:

```text
http://audit-trail:5000/documentation
```

For local development only, if you publish `127.0.0.1:5000:5000`, Swagger will be available at:

```text
http://localhost:5000/documentation
```

---

## Using an external PostgreSQL database

If you already have PostgreSQL running elsewhere, use only the app service:

```yaml
services:
  audit-trail:
    image: juaniviola/audit-trail:latest
    container_name: audit-trail-app
    restart: unless-stopped
    environment:
      NODE_ENV: production
      BACKEND_PORT: 5000
      FRONTEND_PORT: 3000
      INTERNAL_API_URL: http://127.0.0.1:5000

      DB_HOST: your-postgres-host
      DB_PORT: 5432
      DB_USERNAME: your-postgres-user
      DB_PASSWORD: your-postgres-password
      DB_DATABASE: your-postgres-database
      DB_SSL: 'true'

      WAIT_FOR_DB: 'true'
      RUN_MIGRATIONS: 'true'
      CORS_ORIGINS: https://your-internal-ui-domain.example
    ports:
      - '3000:3000'
    expose:
      - '5000'
```

---

## Runtime environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `BACKEND_PORT` | `5000` | Port used by the NestJS backend inside the container. |
| `FRONTEND_PORT` | `3000` | Port used by the Next.js frontend inside the container. |
| `INTERNAL_API_URL` | `http://127.0.0.1:5000` | Backend URL used by the frontend proxy route. Usually keep the default. |
| `DB_HOST` | `localhost` | PostgreSQL host. |
| `DB_PORT` | `5432` | PostgreSQL port. |
| `DB_USERNAME` | `postgres` | PostgreSQL username. |
| `DB_PASSWORD` | `postgres` | PostgreSQL password. |
| `DB_DATABASE` | `audit_trail` | PostgreSQL database name. |
| `DB_SSL` | `false` | Use `true` for managed databases that require SSL. |
| `WAIT_FOR_DB` | same as `RUN_MIGRATIONS` | Waits for PostgreSQL before startup. |
| `RUN_MIGRATIONS` | `false` | Runs TypeORM migrations before starting the apps. Recommended on first startup. |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated browser origins allowed by the backend. This is not authentication. |
| `SWAGGER_PATH` | `documentation` | Swagger route path. |

---

## API endpoints

The backend API is versioned under `/v1`.

### Audit events

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/v1/audit-events` | Record a new audit event. |
| `GET` | `/v1/audit-events` | Search audit events with filters and pagination. |
| `GET` | `/v1/audit-events/:id` | Fetch one audit event by ID. |

### Request logs

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/v1/request-logs` | Record an HTTP request log from an external service. |
| `GET` | `/v1/request-logs` | Search request logs with filters and pagination. |
| `GET` | `/v1/request-logs/:id` | Fetch one request log by ID. |

### Health

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/v1/health` | Backend health endpoint. |

---

## Recommended network topology

For now, treat Audit Trail as an **internal platform service**.

```text
Trusted service A ─┐
Trusted service B ─┼── private network ──> audit-trail:5000
Trusted service C ─┘                         │
                                             └── frontend:3000, optional internal UI
```

Avoid this until authentication is added:

```text
Public internet ──> audit-trail:5000  ❌
```

Better options:

```text
Private VPN ──> reverse proxy with auth ──> audit-trail:3000 / audit-trail:5000 ✅
Internal services ──> Docker/Kubernetes private network ──> audit-trail:5000 ✅
```

---

## Operational notes

- `RUN_MIGRATIONS=true` runs database migrations before the app starts.
- For production, prefer running only one instance with `RUN_MIGRATIONS=true`, then run other replicas with `RUN_MIGRATIONS=false`.
- Persist PostgreSQL data with a Docker volume or use a managed PostgreSQL service.
- Do not store database passwords directly in Compose files for production. Use secrets, environment injection, or your platform's secret manager.
- If you publish port `5000`, protect it with firewall rules, VPN, API gateway, or reverse proxy authentication.

---

## Image

```bash
docker pull juaniviola/audit-trail:latest
```

