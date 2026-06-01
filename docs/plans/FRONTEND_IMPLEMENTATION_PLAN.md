# Frontend Implementation Plan

This document records the approved frontend plan and implementation outcome for the Sezzle calculator take-home assignment.

## Architecture

- **`src/api/calculatorClient.ts`**: `fetch` client for `POST /api/v1/calculate`
- **`src/config/env.ts`**: `VITE_API_BASE_URL` configuration
- **`src/components/Calculator.tsx`**: MUI composition with `useReducer` state machine
- **`src/components/CalculatorDisplay.tsx`**, **`CalculatorKeypad.tsx`**: display and keypad UI
- **`src/components/keypadLayout.ts`**, **`keypadButtons.ts`**: declarative keypad config and button props
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
- Loading (`CircularProgress`) and errors (`Alert`) on the display panel

## Coverage targets (achieved)

| Area | Target | Result |
|------|--------|--------|
| Overall `src/` | ≥ 80% lines | ~83% |
| `calculatorClient.ts` | ≥ 90% | ~96% |
| `Calculator.tsx` | ≥ 80% | ~94% |

## Integration

- `docker-compose.yml` includes `frontend` service (nginx on port 80 → host `FRONTEND_PORT`)
- `just test-frontend` runs Vitest with coverage
- `just run` / `just docker-up` start full stack

## Refactor outcome (principal-review)

- Migrated UI from plain CSS to Material UI while preserving architecture (`useReducer`, API client, gating rules).
- Split display and keypad into focused components; keypad driven by `keypadLayout.ts`.
- Updated `.cursor/rules/project.mdc` and `implement-react-frontend` skill to require MUI.

## Out of scope

- Expression parser, global state libraries (Redux/Zustand)
- OpenAPI codegen for the frontend
