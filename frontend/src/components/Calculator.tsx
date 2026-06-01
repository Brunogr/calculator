import Paper from '@mui/material/Paper';
import { useCallback, useMemo, useReducer } from 'react';
import { calculate, CalculatorApiError } from '../api/calculatorClient';
import { useCalculatorKeyboard } from '../hooks/useCalculatorKeyboard';
import type { Operation } from '../types/calculator';
import { OPERATION_LABELS } from '../types/calculator';
import {
  buildCalculateRequest,
  buildSqrtRequest,
  calculatorReducer,
} from '../utils/calculatorReducer';
import { initialCalculatorState } from '../utils/calculatorState';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorKeypad } from './CalculatorKeypad';

export function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialCalculatorState);

  const runCalculation = useCallback(
    async (build: () => ReturnType<typeof buildCalculateRequest>) => {
      const { request, error } = build();
      if (!request) {
        dispatch({ type: 'CALCULATION_ERROR', message: error ?? 'Calculation failed.' });
        return;
      }
      dispatch({ type: 'CALCULATION_START' });
      try {
        const result = await calculate(request);
        dispatch({ type: 'CALCULATION_SUCCESS', result });
      } catch (err) {
        const message =
          err instanceof CalculatorApiError
            ? err.message
            : 'An unexpected error occurred.';
        dispatch({ type: 'CALCULATION_ERROR', message });
      }
    },
    [],
  );

  const handleEquals = useCallback(() => {
    void runCalculation(() => buildCalculateRequest(state));
  }, [runCalculation, state]);

  const handleSqrt = useCallback(() => {
    void runCalculation(() => buildSqrtRequest(state));
  }, [runCalculation, state]);

  const keypadHandlers = useMemo(
    () => ({
      onDigit: (digit: string) => dispatch({ type: 'DIGIT', digit }),
      onDecimal: () => dispatch({ type: 'DECIMAL' }),
      onClear: () => dispatch({ type: 'CLEAR' }),
      onBackspace: () => dispatch({ type: 'BACKSPACE' }),
      onEquals: handleEquals,
      onSqrt: handleSqrt,
      onBinaryOp: (operation: Operation) =>
        dispatch({ type: 'SELECT_OPERATION', operation }),
    }),
    [handleEquals, handleSqrt],
  );

  useCalculatorKeyboard(state, keypadHandlers);

  const expressionHint =
    state.phase === 'enteringSecond' && state.pendingOperation && state.storedOperand !== null
      ? `${state.storedOperand} ${OPERATION_LABELS[state.pendingOperation]}`
      : '';

  return (
    <Paper
      elevation={0}
      data-testid="calculator"
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 360 },
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'grey.800',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.45)',
      }}
    >
      <CalculatorDisplay
        display={state.display}
        expressionHint={expressionHint}
        phase={state.phase}
        error={state.error}
      />
      <CalculatorKeypad state={state} {...keypadHandlers} />
    </Paper>
  );
}
