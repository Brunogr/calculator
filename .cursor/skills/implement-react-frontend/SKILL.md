---
name: implement-react-frontend
description: Implement or improve the React TypeScript calculator frontend, configuration, tests, and Docker setup.
---

# Implement React Frontend

Use this skill when implementing or improving the frontend.

## Goal

Build a polished but simple React TypeScript frontend that consumes the Go backend API.

The frontend should demonstrate:

- normal and modern calculator layout
- clear user experience
- simple local state
- input validation
- loading/result/error states
- basic responsive design
- environment-based configuration
- testability

## Stack

Use:

- React
- TypeScript
- Vite
- plain CSS or CSS Modules
- fetch API
- Vitest
- React Testing Library

Avoid:

- Preact
- Next.js
- Redux
- Zustand
- React Query
- UI component libraries
- complex custom hooks
- complex expression parsers

## Expected structure

~~~txt
frontend/
  .env.example
  Dockerfile
  src/
    api/
      calculatorClient.ts
    components/
      Calculator.tsx
      Calculator.test.tsx
    config/
      env.ts
    types/
      calculator.ts
    App.tsx
    main.tsx
    index.css
~~~

## Configuration requirements

Create frontend configuration that reads from Vite environment variables.

Required frontend variable:

~~~env
VITE_API_BASE_URL=http://localhost:8080
~~~

Rules:

- Provide `frontend/.env.example`.
- Do not commit real `.env` files.
- The API base URL must be configurable.
- Do not hardcode the backend URL directly inside components.
- Keep configuration in a small module such as `src/config/env.ts`.
- Document all variables in README.md.

## UI direction

Build a normal and modern calculator layout, not a plain form.

Block the digits that doesn't make sense when selecting an operation. This way we prevent errors.
Example:
User selects a number, then click on `add` operator. We block the other operators and let him choose only numbers and the `=` button.
After the result is shown, user can keep iterating over the result, adding other operators that make sense to his previous operation.
Only restart the calculator when user clicks explicitly on the `CE` button.
`sqrt` operator in this scenario can only be available when the result is shown, after a second number is added, it shouldn't.

The UI should include:

- calculator display
- digit buttons `0-9`
- decimal button
- operation buttons:
  - `+`
  - `−`
  - `×`
  - `÷`
  - `xʸ`
  - `√`
  - `%`
- equals button
- clear button
- backspace button
- loading indicator
- visible error message

Keep the design responsive for basic mobile support.

## Calculator behavior

Do not build a complex expression parser.

Use simple calculator behavior:

1. User enters first number.
2. User selects an operation.
3. User enters second number if the operation is binary.
4. User presses equals.
5. Frontend calls backend API.
6. Backend returns result.
7. Frontend updates display.

For unary operations like `sqrt`, the frontend can call the backend using the current display value.

For percentage, use the documented backend behavior:

~~~txt
percentage(value, percent) = value * percent / 100
~~~

Example:

~~~txt
200 % 15 = 30
~~~

## API behavior

The frontend must call the backend API.

Do not calculate final results only on the frontend.

Use:

~~~http
POST /api/v1/calculate
~~~

Request:

~~~json
{
  "operation": "add",
  "operands": [10, 5]
}
~~~

## Operation mapping

Map UI buttons to API operations:

~~~txt
+   -> add
−   -> subtract
×   -> multiply
÷   -> divide
xʸ  -> power
√   -> sqrt
%   -> percentage
~~~

## Validation

Validate:

- missing current value
- missing second operand for binary operations
- invalid number input
- second operand not required for `sqrt`
- prevent duplicate decimals in the same number
- handle backend errors clearly

Backend errors should be displayed clearly to the user.

## State management

Keep state local.

A small `useReducer` is acceptable if it makes calculator behavior clearer, but do not introduce global state libraries.

Avoid complex custom hooks unless the component becomes genuinely hard to read.

## Required tests

Tests should cover:

- initial render
- digit input updates display
- operation selection
- successful binary calculation
- successful unary square root calculation
- backend error display
- clear button
- backspace button
- configurable API base URL behavior if practical

## Docker requirements

Create a frontend Dockerfile.

The frontend container should:

- build the React app
- run without local Node installed
- connect to the backend through Docker Compose configuration

## Validation commands

Run:

~~~bash
cd frontend && npm run test
cd frontend && npm run build
~~~

Also validate through the root justfile when available:

~~~bash
just test-frontend
just run-frontend
~~~

Fix failures before stopping.

## Documentation handoff

Do not perform a full README rewrite from this skill.

When frontend behavior, configuration, commands, Docker setup, API integration, UI behavior, or assumptions change, leave a concise note of what must be reflected in README.md.

The documentation-review skill is responsible for updating README.md and docs/AI_USAGE.md.

Before stopping, summarize any documentation-impacting changes under:

```md
## Documentation notes

- ...
```
