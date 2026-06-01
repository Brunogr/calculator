# Calculator

[![cov](https://brunogr.github.io/calculator/badges/coverage.svg)](https://github.com/Brunogr/calculator/actions)

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

```bash
just test
just build
```

Backend or frontend only: `just test-backend`, `just test-frontend`.

## Justfile reference

| Command | Description |
|---------|-------------|
| `just install` | Backend modules + frontend npm packages |
| `just install-backend` | `go mod download` |
| `just install-frontend` | `npm install` in `frontend/` |
| `just run-backend` | Run Go API locally |
| `just run-frontend` | Vite dev server on `FRONTEND_PORT` |
| `just debug` | Backend + frontend in one terminal with prefixed logs (hot reload) |
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

- Standard calculator keypad (display + buttons).
- Flow: first number → operator → second number → `=` → API call → result.
- After an operator is chosen, other operators are disabled until `=` or **CE**; the selected operator is highlighted.
- **CE** clears all state; **⌫** edits the current entry.
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

### Backend

- **Stdlib HTTP** — no web framework; keeps the assignment small and idiomatic Go without pulling in routing or middleware libraries for a single endpoint.
- **Layered packages** — `internal/calculator` (domain), `internal/httpapi` (transport), and `internal/config` (env) keep calculation logic, HTTP concerns, and configuration separate for testing and review.
- **Stable error codes** — JSON `error.code` values (`DIVISION_BY_ZERO`, `INVALID_OPERAND_COUNT`, etc.) give the frontend and tests predictable error handling instead of parsing message strings.
- **Embedded OpenAPI** — the spec is embedded at build time so Docker images serve `/openapi.yaml` reliably without mounting external files.
- **float64 arithmetic** — standard floating-point behavior via Go's `math` package; no arbitrary-precision library, matching typical calculator expectations for this scope.
- **Operation registry** — `evaluate` maps in `internal/calculator` let new operations register without growing a central switch, keeping `Calculate` open for extension.
- **HTTP request parsing** — `readRequestBody` and `parseCalculateRequest` in `internal/httpapi` keep `ServeHTTP` focused on status codes and response mapping rather than JSON details.

### Frontend

- **`useReducer` for calculator phases** — local state models entry → operator → entry → calculate without Redux or other global state libraries.
- **Material UI** — `Paper`, `Grid`, `Button`, and `Alert` provide a readable calculator layout and accessible feedback without custom theme abstractions.
- **API client separation** — `calculatorClient.ts` isolates `fetch`, request shaping, and error parsing from UI components so tests can mock the API layer cleanly.
- **Button gating** — after an operator is selected, other binary operators are disabled until `=` or **CE**, reducing invalid sequences before calling the API.

## Assumptions

### Backend

- Operations are lowercase strings; leading/trailing whitespace on `operation` is trimmed.
- JSON `null` elements inside `operands` decode as `0` (Go `encoding/json` behavior).

### Frontend

- Final arithmetic is not computed locally; the UI handles display formatting, input validation, and API calls only.
- Material UI is the standard UI layer for this repo (see `.cursor/rules/project.mdc`).

## AI usage

AI was used to support planning, implementation review, test case generation, and documentation review. All generated code was manually reviewed, edited, tested, and validated before submission.

Details: [`docs/AI_USAGE.md`](docs/AI_USAGE.md)
