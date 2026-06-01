# Calculator

A full-stack calculator take-home project with a Go REST API backend and a React TypeScript frontend (frontend in progress). The backend performs all calculations; the UI will send operation requests to the API.

## Tech stack

| Layer | Stack |
|-------|--------|
| Backend | Go 1.22, `net/http`, OpenAPI 3, Swagger UI |
| Frontend | React, TypeScript, Vite, Vitest (planned) |
| Tooling | Docker, docker-compose, [just](https://github.com/casey/just) |

## Project structure

```text
backend/          Go API (implemented)
frontend/         React app (not yet implemented)
docs/             AI usage and implementation plans
.cursor/          Cursor rules and skills for agentic development
docker-compose.yml
justfile
.env.example
```

## Cursor configuration

### Rules

| File | Purpose |
|------|---------|
| [`.cursor/rules/project.mdc`](.cursor/rules/project.mdc) | Global assignment standards: API contract, stack, Docker, justfile, env config, README expectations, scope limits (no DB/auth/parser overengineering). |

### Skills

| Skill | Purpose |
|-------|---------|
| [`implement-go-backend`](.cursor/skills/implement-go-backend/SKILL.md) | Go API structure, validation, OpenAPI/Swagger, tests, Dockerfile. |
| [`implement-react-frontend`](.cursor/skills/implement-react-frontend/SKILL.md) | React calculator UI, API client, Vitest (pending implementation). |
| [`principal-review`](.cursor/skills/principal-review/SKILL.md) | Pre-submission quality gate across correctness, architecture, tests, docs. |
| [`documentation-review`](.cursor/skills/documentation-review/SKILL.md) | README and `docs/AI_USAGE.md` completeness and accuracy. |

## Prerequisites

- Go 1.22+
- [just](https://github.com/casey/just) (recommended command runner)
- Docker (optional, for containerized backend)

## Environment variables

Copy example files and adjust as needed. Do not commit real `.env` files.

**Root** [`.env.example`](.env.example) (used by `just` with `dotenv-load`):

```env
BACKEND_PORT=3000
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:5173
SWAGGER_ENABLED=true
APP_ENV=development
```

**Backend** [`backend/.env.example`](backend/.env.example):

```env
PORT=3000
CORS_ALLOWED_ORIGINS=http://localhost:5173
SWAGGER_ENABLED=true
APP_ENV=development
```

The backend listens on `PORT`, or falls back to `BACKEND_PORT` when running via the root `.env` without duplicating `PORT`.

**Frontend** [`frontend/.env.example`](frontend/.env.example) (for upcoming UI):

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Install

Backend only:

```bash
just install-backend
```

Full stack (when frontend exists):

```bash
just install
```

Underlying command:

```bash
cd backend && go mod download
```

## Run backend (local)

```bash
just run-backend
```

API base URL: `http://localhost:3000` (default). Override with `BACKEND_PORT` or `PORT` in a root `.env` file.

## Run with Docker

Backend service only (current phase):

```bash
just docker-up
# or
just docker-build-backend
docker run --rm -p 3000:3000 calculator-backend
```

`docker compose` maps host `${BACKEND_PORT:-3000}` to container port `3000`.

## Run frontend

Not implemented yet. When available:

```bash
just run-frontend
```

## Tests

Backend tests with coverage:

```bash
just test-backend
```

Build backend binary:

```bash
just build-backend
```

## Justfile reference

| Command | Description |
|---------|-------------|
| `just install-backend` | Download Go modules |
| `just run-backend` | Run API locally |
| `just test-backend` | Backend tests + coverage |
| `just build-backend` | Build `backend/cmd/api` |
| `just docker-build-backend` | Build backend Docker image |
| `just docker-up` | `docker compose up --build backend` |
| `just docker-down` | Stop compose services |
| `just install` | Backend + frontend deps (frontend pending) |
| `just run` | Compose backend (full stack when frontend is added) |

On Windows, the justfile uses PowerShell (`;` command chaining).

## API

### Endpoint

```http
POST /api/v1/calculate
Content-Type: application/json
```

### Request

```json
{
  "operation": "add",
  "operands": [10, 5]
}
```

### Success (200)

```json
{
  "result": 15
}
```

### Error (400)

```json
{
  "error": {
    "code": "DIVISION_BY_ZERO",
    "message": "Cannot divide by zero."
  }
}
```

### curl examples

Addition:

```bash
curl -s -X POST http://localhost:3000/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","operands":[10,5]}'
```

Division by zero:

```bash
curl -s -X POST http://localhost:3000/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","operands":[10,0]}'
```

Percentage (`value * percent / 100`):

```bash
curl -s -X POST http://localhost:3000/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"percentage","operands":[200,15]}'
```

### Supported operations

| Operation | Operands | Description |
|-----------|----------|-------------|
| `add` | 2 | Sum |
| `subtract` | 2 | Difference |
| `multiply` | 2 | Product |
| `divide` | 2 | Quotient; rejects divisor `0` |
| `power` | 2 | `math.Pow(base, exponent)` |
| `sqrt` | 1 | Square root; rejects negative input |
| `percentage` | 2 | `value * percent / 100` |

### Error codes

| Code | HTTP | When |
|------|------|------|
| `INVALID_INPUT` | 400 | Malformed/empty JSON, missing fields, wrong types |
| `UNSUPPORTED_OPERATION` | 400 | Unknown `operation` |
| `INVALID_OPERAND_COUNT` | 400 | Wrong number of operands |
| `INVALID_OPERAND` | 400 | NaN or Infinity operand |
| `DIVISION_BY_ZERO` | 400 | Divide by zero |
| `NEGATIVE_SQRT` | 400 | Square root of negative number |
| `METHOD_NOT_ALLOWED` | 405 | Non-POST on calculate endpoint |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## OpenAPI and Swagger

| Resource | URL (server running) |
|----------|----------------------|
| OpenAPI spec (source) | [`backend/api/openapi.yaml`](backend/api/openapi.yaml) |
| Served spec | http://localhost:3000/openapi.yaml |
| Swagger UI | http://localhost:3000/swagger/ (when `SWAGGER_ENABLED=true`) |

Swagger UI loads assets from the unpkg CDN in the browser.

## Design decisions

- **Stdlib HTTP** — no web framework; keeps the assignment small and idiomatic.
- **Layered packages** — `internal/calculator` (domain), `internal/httpapi` (transport), `internal/config` (env).
- **Stable error codes** — JSON `error.code` for client handling and tests.
- **Embedded OpenAPI** — spec is embedded at build time for reliable Docker serving.
- **float64 arithmetic** — standard floating-point behavior; no arbitrary-precision library.

## Assumptions

- Operations are lowercase strings; leading/trailing whitespace on `operation` is trimmed.
- JSON `null` elements inside `operands` decode as `0` (Go `encoding/json` behavior).
- No authentication, rate limiting, or expression parsing.
- Frontend will call this API using `VITE_API_BASE_URL` (pending).

## AI usage

AI was used to support planning, implementation review, test case generation, and documentation review. All generated code was manually reviewed, edited, tested, and validated before submission.

Details: [`docs/AI_USAGE.md`](docs/AI_USAGE.md)

Implementation plan: [`docs/BACKEND_IMPLEMENTATION_PLAN.md`](docs/BACKEND_IMPLEMENTATION_PLAN.md)

## Current status

| Component | Status |
|-----------|--------|
| Go backend API | Implemented |
| OpenAPI / Swagger | Implemented |
| Backend Docker image | Implemented |
| docker-compose (backend) | Implemented |
| React frontend | Pending |
| Full-stack compose | Pending (frontend service) |
