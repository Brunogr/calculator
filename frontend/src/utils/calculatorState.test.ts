import { describe, expect, it } from 'vitest';
import type { CalculatorState } from '../types/calculator';
import {
  initialCalculatorState,
  isBinaryOpDisabled,
  isEqualsDisabled,
  isSelectedOperation,
  isSqrtDisabled,
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

  it('enables sqrt only after a result is shown', () => {
    expect(isSqrtDisabled(initialCalculatorState)).toBe(true);

    const afterResult: CalculatorState = {
      ...initialCalculatorState,
      phase: 'resultShown',
      display: '16',
    };
    expect(isSqrtDisabled(afterResult)).toBe(false);
  });
});
