import { describe, expect, it, vi } from 'vitest';
import type { CalculatorState } from '../types/calculator';
import { getKeypadButtonSpec } from './keypadButtons';
import { initialCalculatorState } from '../utils/calculatorState';

const handlers = {
  onDigit: vi.fn(),
  onDecimal: vi.fn(),
  onClear: vi.fn(),
  onBackspace: vi.fn(),
  onEquals: vi.fn(),
  onSqrt: vi.fn(),
  onBinaryOp: vi.fn(),
};

describe('getKeypadButtonSpec', () => {
  it('returns specs for utility, numeric, unary, and binary keys', () => {
    expect(getKeypadButtonSpec('ce', initialCalculatorState, handlers)).toMatchObject({
      label: 'CE',
      ariaLabel: 'Clear entry',
      disabled: false,
    });

    expect(getKeypadButtonSpec('backspace', initialCalculatorState, handlers)).toMatchObject({
      label: '⌫',
      ariaLabel: 'Backspace',
    });

    expect(getKeypadButtonSpec('.', initialCalculatorState, handlers)).toMatchObject({
      label: '.',
      ariaLabel: 'Decimal',
    });

    expect(getKeypadButtonSpec('=', initialCalculatorState, handlers)).toMatchObject({
      label: '=',
      ariaLabel: 'Equals',
      isEquals: true,
      disabled: true,
    });

    expect(getKeypadButtonSpec('sqrt', initialCalculatorState, handlers)).toMatchObject({
      label: '√',
      ariaLabel: 'Square root',
    });

    const addSpec = getKeypadButtonSpec('add', initialCalculatorState, handlers);
    expect(addSpec).toMatchObject({
      label: '+',
      ariaLabel: '+',
      isOperator: true,
      disabled: false,
    });

    const digitSpec = getKeypadButtonSpec('7', initialCalculatorState, handlers);
    expect(digitSpec).toMatchObject({
      label: '7',
      ariaLabel: '7',
      disabled: false,
    });
  });

  it('invokes the matching handler when clicked', () => {
    getKeypadButtonSpec('5', initialCalculatorState, handlers).onClick();
    getKeypadButtonSpec('add', initialCalculatorState, handlers).onClick();
    getKeypadButtonSpec('sqrt', initialCalculatorState, handlers).onClick();

    expect(handlers.onDigit).toHaveBeenCalledWith('5');
    expect(handlers.onBinaryOp).toHaveBeenCalledWith('add');
    expect(handlers.onSqrt).toHaveBeenCalled();
  });

  it('marks selected binary operations as pressed and disabled in second entry', () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringSecond',
      display: '',
      storedOperand: 10,
      pendingOperation: 'add',
    };

    expect(getKeypadButtonSpec('add', state, handlers)).toMatchObject({
      pressed: true,
      disabled: true,
    });
  });

  it('returns a disabled fallback spec for unknown keys', () => {
    const spec = getKeypadButtonSpec('unknown' as never, initialCalculatorState, handlers);

    expect(spec.disabled).toBe(true);
    expect(spec.onClick()).toBeUndefined();
  });
});
