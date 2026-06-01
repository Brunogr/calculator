import type { CalculatorState, Operation, Phase } from '../types/calculator';
import { BINARY_OPERATIONS } from '../types/calculator';
import { parseDisplay } from './display';

export const initialCalculatorState: CalculatorState = {
  phase: 'enteringFirst',
  display: '0',
  storedOperand: null,
  pendingOperation: null,
  error: null,
};

export function isValidDisplay(display: string): boolean {
  return parseDisplay(display) !== null;
}

export function isBinaryOperation(operation: Operation): boolean {
  return BINARY_OPERATIONS.includes(operation);
}

/** Binary ops disabled while entering the second operand after a selected operator. */
export function isBinaryOpDisabled(state: CalculatorState, _operation: Operation): boolean {
  if (state.phase === 'loading') {
    return true;
  }
  if (state.phase === 'enteringSecond') {
    return true;
  }
  if (state.phase === 'enteringFirst' || state.phase === 'resultShown') {
    return !isValidDisplay(state.display);
  }
  return true;
}

export function isSelectedOperation(state: CalculatorState, operation: Operation): boolean {
  return state.phase === 'enteringSecond' && state.pendingOperation === operation;
}

/** Sqrt is unary: enabled while entering the first operand or after a result, not during second entry. */
export function isSqrtDisabled(state: CalculatorState): boolean {
  if (state.phase === 'loading' || state.phase === 'enteringSecond') {
    return true;
  }
  if (state.phase === 'enteringFirst' || state.phase === 'resultShown') {
    return !isValidDisplay(state.display);
  }
  return true;
}

export function isEqualsDisabled(state: CalculatorState): boolean {
  if (state.phase === 'loading') {
    return true;
  }
  if (state.phase === 'enteringSecond') {
    return state.storedOperand === null || !isValidDisplay(state.display);
  }
  return true;
}

export function isDigitDisabled(state: CalculatorState): boolean {
  return state.phase === 'loading';
}

export function isClearDisabled(state: CalculatorState): boolean {
  return state.phase === 'loading';
}

export function canStartNewEntryFromResult(phase: Phase): boolean {
  return phase === 'resultShown';
}
