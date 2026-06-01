import { useCallback, useReducer } from 'react';
import { calculate, CalculatorApiError } from '../api/calculatorClient';
import type { Operation } from '../types/calculator';
import { BINARY_OPERATIONS, OPERATION_LABELS } from '../types/calculator';
import {
  buildCalculateRequest,
  buildSqrtRequest,
  calculatorReducer,
} from '../utils/calculatorReducer';
import {
  initialCalculatorState,
  isBinaryOpDisabled,
  isClearDisabled,
  isDigitDisabled,
  isEqualsDisabled,
  isSelectedOperation,
  isSqrtDisabled,
} from '../utils/calculatorState';
import './Calculator.css';

type ButtonSpec = {
  label: string;
  ariaLabel: string;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
};

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

  const handleEquals = () => {
    void runCalculation(() => buildCalculateRequest(state));
  };

  const handleSqrt = () => {
    void runCalculation(() => buildSqrtRequest(state));
  };

  const handleBinaryOp = (operation: Operation) => {
    dispatch({ type: 'SELECT_OPERATION', operation });
  };

  const expressionHint =
    state.phase === 'enteringSecond' && state.pendingOperation && state.storedOperand !== null
      ? `${state.storedOperand} ${OPERATION_LABELS[state.pendingOperation]}`
      : '';

  const rows: ButtonSpec[][] = [
    [
      {
        label: 'CE',
        ariaLabel: 'Clear entry',
        className: 'calculator__btn calculator__btn--wide',
        onClick: () => dispatch({ type: 'CLEAR' }),
        disabled: isClearDisabled(state),
      },
      {
        label: '⌫',
        ariaLabel: 'Backspace',
        className: 'calculator__btn calculator__btn--wide',
        onClick: () => dispatch({ type: 'BACKSPACE' }),
        disabled: isDigitDisabled(state),
      },
    ],
    ['7', '8', '9', 'divide'],
    ['4', '5', '6', 'multiply'],
    ['1', '2', '3', 'subtract'],
    ['0', '.', '=', 'add'],
    ['power', 'sqrt', 'percentage'],
  ];

  function renderKey(key: string): ButtonSpec {
    if (key === '.') {
      return {
        label: '.',
        ariaLabel: 'Decimal',
        onClick: () => dispatch({ type: 'DECIMAL' }),
        disabled: isDigitDisabled(state),
      };
    }
    if (key === '=') {
      return {
        label: '=',
        ariaLabel: 'Equals',
        className: 'calculator__btn calculator__btn--equals',
        onClick: handleEquals,
        disabled: isEqualsDisabled(state),
      };
    }
    if (key === 'sqrt') {
      return {
        label: '√',
        ariaLabel: 'Square root',
        onClick: handleSqrt,
        disabled: isSqrtDisabled(state),
      };
    }
    if (BINARY_OPERATIONS.includes(key as Operation)) {
      const operation = key as Operation;
      return {
        label: OPERATION_LABELS[operation],
        ariaLabel: OPERATION_LABELS[operation],
        className: 'calculator__btn calculator__btn--operator',
        onClick: () => handleBinaryOp(operation),
        disabled: isBinaryOpDisabled(state, operation),
        pressed: isSelectedOperation(state, operation),
      };
    }
    if (/^\d$/.test(key)) {
      return {
        label: key,
        ariaLabel: key,
        onClick: () => dispatch({ type: 'DIGIT', digit: key }),
        disabled: isDigitDisabled(state),
      };
    }
    return {
      label: key,
      ariaLabel: key,
      onClick: () => undefined,
      disabled: true,
    };
  }

  return (
    <div className="calculator" data-testid="calculator">
      <div className="calculator__display-panel">
        {expressionHint ? (
          <div className="calculator__expression" aria-live="polite">
            {expressionHint}
          </div>
        ) : null}
        <div
          className="calculator__display"
          aria-live="polite"
          aria-busy={state.phase === 'loading'}
          data-testid="calculator-display"
        >
          {state.display === '' ? '0' : state.display}
        </div>
        {state.phase === 'loading' ? (
          <div className="calculator__loading" role="status">
            Calculating…
          </div>
        ) : null}
        {state.error ? (
          <div className="calculator__error" role="alert">
            {state.error}
          </div>
        ) : null}
      </div>
      <div className="calculator__keypad">
        {rows.map((row, rowIndex) => (
          <div className="calculator__row" key={rowIndex}>
            {row.map((item) => {
              const spec = typeof item === 'string' ? renderKey(item) : item;
              return (
                <button
                  key={spec.ariaLabel}
                  type="button"
                  className={spec.className ?? 'calculator__btn'}
                  aria-label={spec.ariaLabel}
                  aria-pressed={spec.pressed ?? false}
                  disabled={spec.disabled}
                  onClick={spec.onClick}
                >
                  {spec.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
