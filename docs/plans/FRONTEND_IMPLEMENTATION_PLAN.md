# Frontend Implementation Plan

This document records the approved frontend plan and implementation outcome for the Sezzle calculator take-home assignment.

## Architecture

- **`src/api/calculatorClient.ts`**: `fetch` client for `POST /api/v1/calculate`
- **`src/config/env.ts`**: `VITE_API_BASE_URL` configuration
- **`src/components/Calculator.tsx`**: Calculator UI with `useReducer` state machine
- **`src/utils/calculatorReducer.ts`**: Pure state transitions
- **`src/utils/calculatorState.ts`**: Button gating helpers (respects selected operator in `enteringSecond`)
- **`src/utils/display.ts`**: Display parsing/formatting helpers

## Implemented layout

```text
frontend/
  Dockerfile
  nginx.conf
  package.json
  vite.config.ts
  src/
    api/
    components/
    config/
    types/
    utils/
```

## Calculator UX

- Standard calculator keypad layout (not a form)
- Binary flow: first number → operator (highlighted, others disabled) → second number → `=`
- **CE** is the only full reset
- **√** enabled only after a successful result (`resultShown`)
- All calculations delegated to the backend API
- Loading and error states visible on the display panel

## Coverage targets (achieved)

| Area | Target | Result |
|------|--------|--------|
| Overall `src/` | ≥ 80% lines | ~85% |
| `calculatorClient.ts` | ≥ 90% | ~96% |
| `Calculator.tsx` | ≥ 80% | ~94% |

## Integration

- `docker-compose.yml` includes `frontend` service (nginx on port 80 → host `FRONTEND_PORT`)
- `just test-frontend` runs Vitest with coverage
- `just run` / `just docker-up` start full stack

## Out of scope

- Expression parser, global state libraries, UI kits
- OpenAPI codegen for the frontend
