---
name: implement-go-backend
description: Implement or improve the Go backend REST API, configuration, OpenAPI spec, Swagger docs, validation, and tests for the Sezzle calculator assignment.
---

# Implement Go Backend

Use this skill when implementing or improving the Go backend.

## Goal

Build a small, idiomatic Go REST API for calculator operations.

The backend should demonstrate:

- clean separation between HTTP and calculation logic
- clear API contract
- input validation
- stable JSON error responses
- environment-based configuration
- OpenAPI documentation
- Swagger UI for API exploration
- strong error scenario coverage
- table-driven tests
- simple architecture

## Expected structure

~~~txt
backend/
  .env.example
  Dockerfile
  api/
    openapi.yaml
  cmd/
    api/
      main.go
  internal/
    calculator/
      service.go
      service_test.go
    config/
      config.go
      config_test.go
    httpapi/
      handler.go
      handler_test.go
~~~

## Configuration requirements

Create backend configuration that reads from environment variables.

Required backend variables:

~~~env
PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:5173
SWAGGER_ENABLED=true
APP_ENV=development
~~~

Rules:

- Provide `backend/.env.example`.
- Do not require a real `.env` file to run locally.
- Use sensible defaults if environment variables are missing.
- Backend port must be configurable.
- CORS allowed origins must be configurable.
- Swagger should be possible to disable through configuration if implemented.
- Document all variables in README.md.

Prefer a small `internal/config` package.

Avoid complex configuration frameworks.

## API contract

Endpoint:

~~~http
POST /api/v1/calculate
Content-Type: application/json
~~~

Request:

~~~json
{
  "operation": "add",
  "operands": [10, 5]
}
~~~

Success:

~~~json
{
  "result": 15
}
~~~

Error:

~~~json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Human-readable message."
  }
}
~~~

## Operations

Support:

- `add`: two operands
- `subtract`: two operands
- `multiply`: two operands
- `divide`: two operands, reject division by zero
- `power`: two operands
- `sqrt`: one operand, reject negative values
- `percentage`: two operands, defined as `value * percent / 100`

Use `float64` and document that the API uses standard floating-point arithmetic.

## OpenAPI and Swagger requirements

Create an OpenAPI 3 specification for the calculator endpoint.

Required file:

~~~txt
backend/api/openapi.yaml
~~~

The OpenAPI spec must document:

- `POST /api/v1/calculate`
- request body schema
- success response schema
- error response schema
- supported operation values
- example requests
- example success responses
- example error responses
- possible HTTP status codes

Expose Swagger UI from the backend so reviewers can inspect the API in the browser.

Preferred routes:

~~~txt
/openapi.yaml
/swagger/
~~~

Keep the OpenAPI spec aligned with the actual implementation.

Do not generate excessive code from OpenAPI unless it clearly simplifies the assignment.

## Implementation rules

Prefer:

- Go standard library where reasonable
- simple package names
- explicit error handling
- table-driven tests
- small functions
- readable validation
- clear domain errors
- stable API error codes

Avoid:

- unnecessary web frameworks
- dependency injection frameworks
- unnecessary interfaces
- global mutable state
- goroutines
- complex middleware stacks
- Java/C#/TypeScript-style architecture

## Error scenarios to uncover and test

Think like a senior engineer and actively look for edge cases.

At minimum, handle and test:

### Request and transport errors

- unsupported HTTP method
- malformed JSON
- empty request body
- missing `operation`
- missing `operands`
- `operands` is null
- too few operands
- too many operands
- unsupported operation
- invalid JSON types
- request with extra fields should not break the API
- CORS preflight if CORS is implemented manually

### Domain errors

- division by zero
- square root of negative number
- invalid operand count for unary operation
- invalid operand count for binary operation
- unsupported operation

### Numeric concerns

- decimal values
- negative values
- zero values
- large values if reasonable
- power with zero exponent
- percentage with decimal percent

Do not overcomplicate with arbitrary precision unless explicitly required.

## Calculator service tests

Use table-driven tests for:

- add
- subtract
- multiply
- divide
- division by zero
- power
- power with zero exponent
- square root
- negative square root
- percentage
- unsupported operation
- missing operands
- too many operands
- decimal operands
- negative operands

## HTTP handler tests

Cover:

- successful response
- malformed JSON
- empty body
- unsupported method
- unsupported operation
- invalid operand count
- division by zero response
- negative square root response
- response `Content-Type`
- stable error response shape
- OpenAPI file route if served by backend
- Swagger route if served by backend

## Docker requirements

Create a backend Dockerfile.

The backend container should:

- build the Go API
- expose the API port
- run without local Go installed
- serve `/api/v1/calculate`
- serve `/openapi.yaml`
- serve `/swagger/`

The Dockerfile should not depend on a local `.env` file.

## Validation commands

Run:

~~~bash
cd backend && go test ./... -cover
~~~

Also validate through the root justfile when available:

~~~bash
just test-backend
just run-backend
~~~

Fix failures before stopping.

## Documentation handoff

Do not perform a full README rewrite from this skill.

When backend behavior, configuration, commands, API contract, Docker setup, OpenAPI, Swagger, or assumptions change, leave a concise note of what must be reflected in README.md.

The documentation-review skill is responsible for updating README.md and docs/AI_USAGE.md.

Before stopping, summarize any documentation-impacting changes under:

```md
## Documentation notes

- ...
```
