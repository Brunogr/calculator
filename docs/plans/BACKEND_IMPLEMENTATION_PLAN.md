# Go Backend Implementation Plan

This document records the approved backend plan and implementation outcome for the Sezzle calculator take-home assignment.

## Architecture

- **`cmd/api`**: HTTP server bootstrap
- **`internal/calculator`**: Pure calculation logic and domain errors
- **`internal/config`**: Environment-based configuration
- **`internal/httpapi`**: JSON API, CORS, OpenAPI/Swagger routes
- **`api/openapi.yaml`**: OpenAPI 3 contract (embedded via root `backend` package)

## Implemented layout

```text
backend/
  go.mod
  go.sum
  Dockerfile
  openapi_embed.go
  api/openapi.yaml
  cmd/api/main.go
  internal/calculator/
  internal/config/
  internal/httpapi/
```

## API

- `POST /api/v1/calculate` — calculator operations
- `GET /openapi.yaml` — OpenAPI spec
- `GET /swagger/` — Swagger UI (when `SWAGGER_ENABLED=true`)

## Error codes

| Code | When |
|------|------|
| `INVALID_INPUT` | Malformed/empty JSON, missing fields, wrong types |
| `UNSUPPORTED_OPERATION` | Unknown operation |
| `INVALID_OPERAND_COUNT` | Wrong number of operands |
| `INVALID_OPERAND` | NaN or Infinity operands |
| `DIVISION_BY_ZERO` | Divide by zero |
| `NEGATIVE_SQRT` | Square root of negative number |
| `METHOD_NOT_ALLOWED` | Non-POST on calculate endpoint |
| `INTERNAL_ERROR` | Unexpected server error |

## Coverage targets (achieved)

| Package | Target | Result |
|---------|--------|--------|
| `internal/calculator` | ≥ 90% | 94.6% |
| `internal/httpapi` | ≥ 85% | 85.1% |
| `internal/config` | ≥ 80% | 100% |

## Out of scope (follow-up)

- Frontend and `docker-compose.yml` service wiring
- Full README update (see documentation-review skill)
