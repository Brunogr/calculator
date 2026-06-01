import { describe, expect, it } from 'vitest';
import type { CalculatorState } from '../types/calculator';
import {
  canStartNewEntryFromResult,
  initialCalculatorState,
  isBinaryOpDisabled,
  isBinaryOperation,
  isClearDisabled,
  isDigitDisabled,
  isEqualsDisabled,
  isSelectedOperation,
  isSqrtDisabled,
  isValidDisplay,
} from './calculatorState';

describe('calculatorState gating', () => {
  it('disables binary operators while entering the second operand', () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringSecond',
      display: '',
      storedOperand: 10,
      pendingOperation: 'add',
    };

    expect(isBinaryOpDisabled(state, 'multiply')).toBe(true);
    expect(isSelectedOperation(state, 'add')).toBe(true);
    expect(isEqualsDisabled(state)).toBe(true);
    expect(isSqrtDisabled(state)).toBe(true);
  });

  it('enables equals when second operand is valid', () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringSecond',
      display: '5',
      storedOperand: 10,
      pendingOperation: 'add',
    };

    expect(isEqualsDisabled(state)).toBe(false);
  });

  it('enables sqrt while entering the first operand or after a result', () => {
    expect(isSqrtDisabled(initialCalculatorState)).toBe(false);

    const enteringFirst: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringFirst',
      display: '16',
    };
    expect(isSqrtDisabled(enteringFirst)).toBe(false);

    const afterResult: CalculatorState = {
      ...initialCalculatorState,
      phase: 'resultShown',
      display: '16',
    };
    expect(isSqrtDisabled(afterResult)).toBe(false);
  });

  it('disables controls while loading and invalid displays', () => {
    const loading: CalculatorState = { ...initialCalculatorState, phase: 'loading' };
    expect(isBinaryOpDisabled(loading, 'add')).toBe(true);
    expect(isDigitDisabled(loading)).toBe(true);
    expect(isClearDisabled(loading)).toBe(true);
    expect(isEqualsDisabled(loading)).toBe(true);

    const invalidDisplay: CalculatorState = { ...initialCalculatorState, display: '.' };
    expect(isBinaryOpDisabled(invalidDisplay, 'add')).toBe(true);
    expect(isSqrtDisabled(invalidDisplay)).toBe(true);
  });

  it('validates display values and operation types', () => {
    expect(isValidDisplay('12')).toBe(true);
    expect(isValidDisplay('.')).toBe(false);
    expect(isBinaryOperation('add')).toBe(true);
    expect(isBinaryOperation('sqrt')).toBe(false);
    expect(canStartNewEntryFromResult('resultShown')).toBe(true);
    expect(canStartNewEntryFromResult('enteringFirst')).toBe(false);
  });
});
