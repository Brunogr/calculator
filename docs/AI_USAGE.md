# AI Usage

This project used AI assistance as a development aid. All generated code was manually reviewed, edited, tested, and validated before submission.

## How AI was used

AI was used for:

- planning a simple full-stack architecture appropriate for a time-boxed take-home assignment
- reviewing idiomatic Go backend structure
- identifying backend error scenarios and test cases
- reviewing API design, OpenAPI documentation, and Swagger setup
- implementing and reviewing React TypeScript frontend structure
- reviewing Docker and justfile developer workflow
- reviewing README clarity

AI was not used as a replacement for final engineering judgment. The solution was intentionally kept small and focused on correctness, maintainability, testability, and reviewer-friendly setup.

## AI-assisted workflow

I used Cursor with scoped project rules and task-specific skills.

The project rule captured global project constraints such as avoiding overengineering, keeping the API contract stable, dockerizing the app, using a justfile for common commands, using environment-based configuration, and keeping documentation updated.

The skills were used for:

- Go backend implementation guidance
- React frontend implementation guidance
- final principal-level repository review
- documentation review

## Implementation plans

Each major implementation phase has a plan document under [`docs/plans/`](plans/):

| Plan | Document | Related prompts |
|------|----------|-----------------|
| Backend | [`BACKEND_IMPLEMENTATION_PLAN.md`](plans/BACKEND_IMPLEMENTATION_PLAN.md) | 2–5 |
| Frontend | [`FRONTEND_IMPLEMENTATION_PLAN.md`](plans/FRONTEND_IMPLEMENTATION_PLAN.md) | 6–7 |
| Principal review refactor | [`PRINCIPAL_REVIEW_REFACTOR_PLAN.md`](plans/PRINCIPAL_REVIEW_REFACTOR_PLAN.md) | 8+ |

## Prompt log

### Prompt 1

```txt
Based on the initial project setup, please improve the Cursor rules and skills so we can start the agentic development flow for this assessment.

Important: do not implement the calculator yet. For now, only update the rules and skill files.

Project context:

We need to implement a calculator with separate backend and frontend projects. The goal is not to build a complex calculator platform. The goal is to demonstrate correctness, clarity, maintainability, testability, clean API design, practical AI usage, and good engineering judgment.

The main project requirements should live in:

@.cursor/rules/project.mdc

Please improve this rules file with the general standards for the project, including:

* keep backend and frontend as separate projects
* keep the solution simple and professional
* avoid overengineering and unnecessary dependencies
* dockerize the project
* use a root docker-compose.yml to run the full stack
* use a root justfile for common commands like install, run, debug, test, lint and format
* make sure every meaningful implementation change is later reflected in README.md
* keep configuration flexible, especially API URLs and ports
* avoid hardcoded localhost ports in application code

Frontend:

Please improve:

@.cursor/skills/implement-react-frontend/SKILL.md

The frontend should use React, TypeScript, Vite and Vitest.

We want a normal modern calculator UI, not a form calculator. Think of a standard calculator layout with display, keypad, operations, clear button, result and error handling.

Keep it simple:

* simple local state
* loading, result and error states when calling the backend
* responsive layout
* no third-party UI libraries unless really necessary
* no complex custom hooks unless there is a clear reason
* meaningful Vitest tests for interactions, API success and API errors
* follow the backend API contract instead of inventing endpoints

Backend:

Please improve:

@.cursor/skills/implement-go-backend/SKILL.md

The backend should be a Go REST API following Go best practices and the structure already expected by this skill.

Please make sure the backend skill covers:

* clean REST API design
* the API endpoint structure already defined in the skill
* clear request and response models
* input validation
* consistent error responses
* proper HTTP status codes
* calculator logic separated from handlers
* table-driven tests for calculator behavior
* handler/API tests for success and error scenarios
* OpenAPI documentation
* Swagger UI or equivalent API exploration
* minimal dependencies

Review skills:

Please improve:

@.cursor/skills/principal-review/SKILL.md

This should be the final engineering quality gate. It should verify correctness, test coverage, clean API design, maintainability, Docker, justfile, OpenAPI/Swagger, README updates, and whether the implementation stayed within the intended simple calculator scope.

Please also improve:

@.cursor/skills/documentation-review/SKILL.md

This skill should validate that documentation is concise, up-to-date, and useful. It should check README.md for setup, run commands, test commands, Docker usage, justfile commands, environment variables, API examples, supported operations, OpenAPI/Swagger locations, design decisions and known assumptions.

Important detail:

Please avoid duplicating responsibilities across skills. The implementation skills can mention that README.md must be updated later, but the documentation-review skill should be responsible for validating documentation quality.

Please create a plan and what you're intending to change, so i can review.

```

### Prompt 2

**Plan:** [`docs/plans/BACKEND_IMPLEMENTATION_PLAN.md`](plans/BACKEND_IMPLEMENTATION_PLAN.md)

```txt
Use the project rules @.cursor/rules/project.mdc and the @.cursor/skills/implement-go-backend/SKILL.md skill.

Create an implementation plan only. Do not write code yet.

Scope: backend implementation only.

Please include:

1. Files you will create or modify
2. Implementation order
3. Test strategy
4. Coverage strategy
5. Any risks or assumptions

Keep the plan aligned with the existing rules/skills and avoid adding features outside the assignment scope.

Share as much information as you can so i can better evaluate the plan. Also, create the plan md file inside the project as a documentation.
```

### Prompt 3

**Plan:** [`docs/plans/BACKEND_IMPLEMENTATION_PLAN.md`](plans/BACKEND_IMPLEMENTATION_PLAN.md)

```txt
Proceed with the approved backend implementation.

Be aware to add more test cases than the ones already added as example. You can try other error scenarios as tests and you can add new error codes as needed.

After implementation, run the backend test and coverage commands through the justfile. Fix failures before stopping.

At the end, return:

1. Summary of changes
2. Commands executed
3. Test and coverage results
4. Known limitations, if any
5. Documentation notes for the documentation-review skill
```

### Prompt 4

**Plan:** [`docs/plans/BACKEND_IMPLEMENTATION_PLAN.md`](plans/BACKEND_IMPLEMENTATION_PLAN.md)

```txt
Run principal-review on the backend phase, fix concrete findings (Docker, config, justfile, API consistency), then documentation-review to update README and AI_USAGE.
```

### Prompt 5

**Plan:** [`docs/plans/FRONTEND_IMPLEMENTATION_PLAN.md`](plans/FRONTEND_IMPLEMENTATION_PLAN.md)

```txt
Use the project rules and the implement-react-frontend skill.

Create an implementation plan for the frontend only, including files, UI/state approach, API integration, tests, coverage, and risks. Save the plan under docs/plans/.
```

### Prompt 6

**Plan:** [`docs/plans/FRONTEND_IMPLEMENTATION_PLAN.md`](plans/FRONTEND_IMPLEMENTATION_PLAN.md)

```txt
Proceed with the approved frontend implementation.

Button gating should consider the operator selected after the first input value.

After implementation: run frontend tests, build, and coverage through the justfile; fix failures; run principal-review for the full stack and fix concrete findings; run documentation-review.
```

### Prompt 7

**Plan:** [`docs/plans/PRINCIPAL_REVIEW_REFACTOR_PLAN.md`](plans/PRINCIPAL_REVIEW_REFACTOR_PLAN.md)

```txt
Implement the Principal Review Refactor Plan: update project.mdc and implement-react-frontend skill for MUI first, refactor frontend to Material UI without changing architecture, apply backend clean-code improvements (operation registry, request parsing extract), run full tests/build/coverage, and update documentation.
```

### Prompt 8

**Plan:** [`docs/plans/PRINCIPAL_REVIEW_REFACTOR_PLAN.md`](plans/PRINCIPAL_REVIEW_REFACTOR_PLAN.md) (documentation follow-up)

```txt
run @.cursor/skills/documentation-review/SKILL.md to separate design decisions between frontend and backend.
Review the file and remove texts that are not that relevant.
Create still have this requirement - Unit tests and coverage report - that is not covered, so let's add a coverage badge to show an alive coverage percentage inside the github repository. This is the badge reference: https://github.com/marketplace/actions/coverage-badge.

Show me what you are planning to do step by step.
```

### Prompt 9

```txt
increase the test coverage for the entire project to 90%
```

## Final validation

Commands run before submission:

```bash
just test
just build
just docker-build
```

Results:

- Backend: `internal/calculator` 97.6%, `internal/httpapi` 93.0%, `internal/config` 100% (merged internal packages: 94.9%)
- Frontend: 58 tests passed; ~99% statement coverage (Vitest threshold: 90%)
- Coverage badge updated by GitHub Actions on push to `main`
- Full `just build` succeeded (Go binary + Vite production bundle with MUI)
- Docker images build successfully
