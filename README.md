# Calculator

A full-stack calculator take-home project with a Go REST API backend and a React TypeScript frontend. The backend performs all calculations; the UI sends operation requests to the API and displays results and errors.

## Tech stack

| Layer | Stack |
|-------|--------|
| Backend | Go 1.22, `net/http`, OpenAPI 3, Swagger UI |
| Frontend | React 18, TypeScript, Vite, Material UI, Vitest, React Testing Library |
| Tooling | Docker, docker-compose, [just](https://github.com/casey/just) |

## Project structure

```text
backend/          Go API
frontend/         React calculator UI
docs/             AI usage and implementation plans
docs/plans/       Backend and frontend implementation plans
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
| [`implement-react-frontend`](.cursor/skills/implement-react-frontend/SKILL.md) | React calculator UI, API client, Vitest, Docker. |
| [`principal-review`](.cursor/skills/principal-review/SKILL.md) | Pre-submission quality gate across correctness, architecture, tests, docs. |
| [`documentation-review`](.cursor/skills/documentation-review/SKILL.md) | README and `docs/AI_USAGE.md` completeness and accuracy. |

## Prerequisites

- Go 1.22+
- Node.js 20+ and npm (for local frontend development)
- [just](https://github.com/casey/just) (recommended command runner)
- Docker (optional, for containerized full stack)

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

**Frontend** [`frontend/.env.example`](frontend/.env.example):

```env
VITE_API_BASE_URL=http://localhost:3000
```

For local dev, copy to `frontend/.env`. For Docker, `VITE_API_BASE_URL` is passed as a build argument (browser calls the published backend URL on the host, typically `http://localhost:3000`).

## Install

```bash
just install
```

Backend only:

```bash
just install-backend
```

Frontend only:

```bash
just install-frontend
```

## Run locally

Start backend + frontend in **one terminal** with prefixed logs and hot reload:

```bash
just debug
```

`just debug` runs `scripts/dev.mjs`, which:
- stops a stale backend on `BACKEND_PORT` and clears `backend/tmp/` when possible (skips with a warning if files are locked)
- starts backend with [air](https://github.com/air-verse/air) (`[backend]` log prefix)
- starts frontend with Vite (`[frontend]` log prefix)
- sets `VITE_API_BASE_URL` from the root `.env` / `.env.example` defaults (`http://localhost:3000` when unset)

Copy [`.env.example`](.env.example) to `.env` at the repo root for custom ports and API URL. `just` loads that file via `dotenv-load`.

Or run each service manually in separate terminals.

Start the API (terminal 1):

```bash
just run-backend
```

Start the UI (terminal 2):

```bash
just run-frontend
```

Open http://localhost:5173 (default). The UI calls the API at `VITE_API_BASE_URL`.

## Run with Docker

Full stack:

```bash
just dev
```

- API: http://localhost:3000 (default `BACKEND_PORT`)
- UI: http://localhost:5173 (default `FRONTEND_PORT`, nginx serving the built React app)

Stop services:

```bash
just docker-down
```

Build images without starting:

```bash
just docker-build
```

## Tests and build

All tests (backend + frontend with coverage):

```bash
just test
```

Backend:

```bash
just test-backend
```

Frontend (Vitest + coverage):

```bash
just test-frontend
```

Build both:

```bash
just build
```

## Justfile reference

| Command | Description |
|---------|-------------|
| `just install` | Backend modules + frontend npm packages |
| `just install-backend` | `go mod download` |
| `just install-frontend` | `npm install` in `frontend/` |
| `just run-backend` | Run Go API locally |
| `just run-frontend` | Vite dev server on `FRONTEND_PORT` |
| `just debug` | Backend + frontend in one terminal with prefixed logs (hot reload) |
| `just run` | Alias for `just dev` |
| `just dev` | `docker compose up --build` (full stack) |
| `just test` | Backend and frontend tests with coverage |
| `just test-backend` | Go tests with coverage |
| `just test-frontend` | Vitest with coverage |
| `just build` | Backend binary + frontend production build |
| `just build-backend` | Build `backend/cmd/api` |
| `just build-frontend` | Vite production build |
| `just docker-build` | Build compose images |
| `just docker-down` | Stop compose services |

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

## Frontend calculator behavior

- Standard calculator keypad (display + buttons), not a form.
- Flow: first number → operator → second number → `=` → API call → result.
- After an operator is chosen, other operators are disabled until `=` or **CE**; the selected operator is highlighted.
- **CE** clears all state; **⌫** edits the current entry.
- **√** is available only after a successful result is shown.
- Errors use MUI `Alert`; loading uses `CircularProgress`.
- Keyboard: `0–9`, `.`, `+` `−` `*` `/`, `Enter`/`=`, `Backspace`, `Esc`/`Delete` (clear), `%`, `^` (power), `R` (√).
- Chaining: after a result, pick a new operator to use the result as the first operand.
- Percentage: `value` `%` `percent` `=` (e.g. 200 % 15 = 30).

UI labels map to API operations: `+` → `add`, `−` → `subtract`, `×` → `multiply`, `÷` → `divide`, `xʸ` → `power`, `√` → `sqrt`, `%` → `percentage`.

## OpenAPI and Swagger

| Resource | URL (server running) |
|----------|----------------------|
| OpenAPI spec (source) | [`backend/api/openapi.yaml`](backend/api/openapi.yaml) |
| Served spec | http://localhost:3000/openapi.yaml |
| Swagger UI | http://localhost:3000/swagger/ (when `SWAGGER_ENABLED=true`) |

Swagger UI loads assets from the unpkg CDN in the browser.

## Design decisions

- **Stdlib HTTP (backend)** — no web framework; keeps the assignment small and idiomatic.
- **Layered backend packages** — `internal/calculator` (domain), `internal/httpapi` (transport), `internal/config` (env).
- **Stable error codes** — JSON `error.code` for client handling and tests.
- **Embedded OpenAPI** — spec is embedded at build time for reliable Docker serving.
- **float64 arithmetic** — standard floating-point behavior; no arbitrary-precision library.
- **Frontend `useReducer`** — local calculator phases without global state libraries.
- **Material UI** — readable calculator layout (`Paper`, `Grid`, `Button`, `Alert`) without custom theme abstractions.
- **API client separation** — `calculatorClient.ts` isolates `fetch` from UI components.
- **Button gating** — reduces invalid sequences before calling the API.
- **Backend operation registry** — `evaluate` maps in `internal/calculator` keep `Calculate` open for new operations without growing a central switch.
- **HTTP request parsing** — `readRequestBody` and `parseCalculateRequest` in `internal/httpapi` keep `ServeHTTP` focused on transport mapping.

## Assumptions

- Operations are lowercase strings; leading/trailing whitespace on `operation` is trimmed (backend).
- JSON `null` elements inside `operands` decode as `0` (Go `encoding/json` behavior).
- No authentication, rate limiting, or expression parsing.
- Frontend does not compute final results locally; only display formatting and input validation.
- Material UI is the standard UI layer for this repo (see `.cursor/rules/project.mdc`).
- Docker UI build uses a browser-reachable API URL (`http://localhost:3000` by default), not an internal Docker service hostname.

## AI usage

AI was used to support planning, implementation review, test case generation, and documentation review. All generated code was manually reviewed, edited, tested, and validated before submission.

Details: [`docs/AI_USAGE.md`](docs/AI_USAGE.md)

Implementation plans:

- [`docs/plans/BACKEND_IMPLEMENTATION_PLAN.md`](docs/plans/BACKEND_IMPLEMENTATION_PLAN.md)
- [`docs/plans/FRONTEND_IMPLEMENTATION_PLAN.md`](docs/plans/FRONTEND_IMPLEMENTATION_PLAN.md)

## Current status

| Component | Status |
|-----------|--------|
| Go backend API | Implemented |
| OpenAPI / Swagger | Implemented |
| React frontend | Implemented |
| Backend Docker image | Implemented |
| Frontend Docker image | Implemented |
| Full-stack docker-compose | Implemented |
| Tests (backend + frontend) | Implemented |
