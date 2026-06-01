import type { CalculatorState, Operation } from '../types/calculator';
import { initialCalculatorState } from './calculatorState';
import {
  appendDecimal,
  appendDigit,
  backspaceDisplay,
  formatResult,
  parseDisplay,
} from './display';
import { isBinaryOperation } from './calculatorState';

export type CalculatorAction =
  | { type: 'DIGIT'; digit: string }
  | { type: 'DECIMAL' }
  | { type: 'BACKSPACE' }
  | { type: 'CLEAR' }
  | { type: 'SELECT_OPERATION'; operation: Operation }
  | { type: 'SQRT' }
  | { type: 'CALCULATION_START' }
  | { type: 'CALCULATION_SUCCESS'; result: number }
  | { type: 'CALCULATION_ERROR'; message: string };

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      if (state.phase === 'loading') {
        return state;
      }
      const base =
        state.phase === 'resultShown'
          ? '0'
          : state.display;
      return {
        ...state,
        phase: state.phase === 'resultShown' ? 'enteringFirst' : state.phase,
        display: appendDigit(base, action.digit),
        storedOperand: state.phase === 'resultShown' ? null : state.storedOperand,
        pendingOperation: state.phase === 'resultShown' ? null : state.pendingOperation,
        error: null,
      };
    }
    case 'DECIMAL': {
      if (state.phase === 'loading') {
        return state;
      }
      const base =
        state.phase === 'resultShown'
          ? '0'
          : state.display;
      return {
        ...state,
        phase: state.phase === 'resultShown' ? 'enteringFirst' : state.phase,
        display: appendDecimal(base),
        storedOperand: state.phase === 'resultShown' ? null : state.storedOperand,
        pendingOperation: state.phase === 'resultShown' ? null : state.pendingOperation,
        error: null,
      };
    }
    case 'BACKSPACE': {
      if (state.phase === 'loading') {
        return state;
      }
      const nextDisplay =
        state.phase === 'enteringSecond' && state.display.length <= 1
          ? ''
          : backspaceDisplay(state.display);
      return {
        ...state,
        display: nextDisplay,
        error: null,
      };
    }
    case 'CLEAR':
      return { ...initialCalculatorState };
    case 'SELECT_OPERATION': {
      if (!isBinaryOperation(action.operation)) {
        return state;
      }
      const first = parseDisplay(state.display);
      if (first === null) {
        return { ...state, error: 'Enter a valid number first.' };
      }
      return {
        ...state,
        phase: 'enteringSecond',
        storedOperand: first,
        pendingOperation: action.operation,
        display: '',
        error: null,
      };
    }
    case 'SQRT':
      return { ...state, phase: 'loading', error: null };
    case 'CALCULATION_START':
      return { ...state, phase: 'loading', error: null };
    case 'CALCULATION_SUCCESS':
      return {
        phase: 'resultShown',
        display: formatResult(action.result),
        storedOperand: null,
        pendingOperation: null,
        error: null,
      };
    case 'CALCULATION_ERROR': {
      const resumePhase =
        state.pendingOperation !== null && state.storedOperand !== null
          ? 'enteringSecond'
          : state.pendingOperation === null && state.storedOperand === null
            ? 'resultShown'
            : 'enteringFirst';
      return {
        ...state,
        phase: resumePhase,
        error: action.message,
      };
    }
    default:
      return state;
  }
}

export function buildCalculateRequest(state: CalculatorState): {
  request: { operation: Operation; operands: number[] } | null;
  error: string | null;
} {
  if (state.phase === 'enteringSecond' && state.pendingOperation && state.storedOperand !== null) {
    const second = parseDisplay(state.display);
    if (second === null) {
      return { request: null, error: 'Enter the second number.' };
    }
    return {
      request: {
        operation: state.pendingOperation,
        operands: [state.storedOperand, second],
      },
      error: null,
    };
  }
  return { request: null, error: 'Nothing to calculate.' };
}

export function buildSqrtRequest(state: CalculatorState): {
  request: { operation: Operation; operands: number[] } | null;
  error: string | null;
} {
  const value = parseDisplay(state.display);
  if (value === null) {
    return { request: null, error: 'Enter a valid number first.' };
  }
  return {
    request: { operation: 'sqrt', operands: [value] },
    error: null,
  };
}
