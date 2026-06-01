---
name: documentation-review
description: Review and improve README and AI usage documentation for the Sezzle calculator assignment.
---

# Documentation Review

Use this skill when creating or improving README.md and docs/AI_USAGE.md.

## README must include

- project overview
- tech stack
- setup instructions
- .cursor file structure and explanation of every rule and skills
- environment variables
- justfile command reference
- how to install dependencies
- how to run backend
- how to run frontend
- how to run the full stack
- how to run with Docker
- how to run tests
- API examples with curl
- supported operations
- OpenAPI spec location
- Swagger UI location
- error response examples
- design decisions
- assumptions
- AI usage summary linking to docs/AI_USAGE.md

## Environment documentation

README must document:

Root variables:

~~~env
BACKEND_PORT=8080
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:8080
CORS_ALLOWED_ORIGINS=http://localhost:5173
SWAGGER_ENABLED=true
~~~

Backend variables:

~~~env
PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:5173
SWAGGER_ENABLED=true
APP_ENV=development
~~~

Frontend variables:

~~~env
VITE_API_BASE_URL=http://localhost:8080
~~~

## AI_USAGE.md must include

- how AI was used
- prompt log
- statement that generated code was reviewed and tested
- final validation commands

## Tone

Keep documentation:

- concise
- professional
- honest
- not defensive
- not overly long

Avoid saying:

- “I do not know Go”
- “AI built this”
- “I relied on AI”

Prefer:

- “AI was used to support planning, implementation review, test case generation, and documentation review.”
- “All generated code was manually reviewed, edited, tested, and validated before submission.”

## Output

Return improved documentation or concrete documentation findings.