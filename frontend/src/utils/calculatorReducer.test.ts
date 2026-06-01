import { describe, expect, it } from 'vitest';
import type { CalculatorState } from '../types/calculator';
import {
  buildCalculateRequest,
  buildSqrtRequest,
  calculatorReducer,
} from './calculatorReducer';
import { initialCalculatorState } from './calculatorState';

describe('calculatorReducer', () => {
  it('ignores digit and decimal input while loading', () => {
    const loading: CalculatorState = { ...initialCalculatorState, phase: 'loading' };

    expect(calculatorReducer(loading, { type: 'DIGIT', digit: '5' })).toBe(loading);
    expect(calculatorReducer(loading, { type: 'DECIMAL' })).toBe(loading);
    expect(calculatorReducer(loading, { type: 'BACKSPACE' })).toBe(loading);
  });

  it('starts a new entry from a shown result when typing digits or decimals', () => {
    const afterResult: CalculatorState = {
      phase: 'resultShown',
      display: '42',
      storedOperand: null,
      pendingOperation: null,
      error: null,
    };

    expect(calculatorReducer(afterResult, { type: 'DIGIT', digit: '7' })).toMatchObject({
      phase: 'enteringFirst',
      display: '7',
      storedOperand: null,
      pendingOperation: null,
      error: null,
    });

    expect(calculatorReducer(afterResult, { type: 'DECIMAL' })).toMatchObject({
      phase: 'enteringFirst',
      display: '0.',
      error: null,
    });
  });

  it('appends digits during normal entry', () => {
    const state: CalculatorState = { ...initialCalculatorState, display: '12' };
    expect(calculatorReducer(state, { type: 'DIGIT', digit: '3' }).display).toBe('123');
  });

  it('clears the second operand display on backspace when only one character remains', () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringSecond',
      display: '5',
      storedOperand: 10,
      pendingOperation: 'add',
    };

    expect(calculatorReducer(state, { type: 'BACKSPACE' }).display).toBe('');
  });

  it('backspaces normally outside enteringSecond single-char case', () => {
    const state: CalculatorState = { ...initialCalculatorState, display: '123' };
    expect(calculatorReducer(state, { type: 'BACKSPACE' }).display).toBe('12');
  });

  it('resets to initial state on clear', () => {
    const dirty: CalculatorState = {
      phase: 'enteringSecond',
      display: '5',
      storedOperand: 10,
      pendingOperation: 'multiply',
      error: 'oops',
    };

    expect(calculatorReducer(dirty, { type: 'CLEAR' })).toEqual(initialCalculatorState);
  });

  it('ignores unary operations in select operation', () => {
    expect(
      calculatorReducer(initialCalculatorState, { type: 'SELECT_OPERATION', operation: 'sqrt' }),
    ).toBe(initialCalculatorState);
  });

  it('requires a valid first operand before selecting a binary operation', () => {
    const invalid: CalculatorState = { ...initialCalculatorState, display: '.' };

    expect(
      calculatorReducer(invalid, { type: 'SELECT_OPERATION', operation: 'add' }),
    ).toMatchObject({ error: 'Enter a valid number first.' });
  });

  it('stores the first operand and clears display when selecting a binary operation', () => {
    const state: CalculatorState = { ...initialCalculatorState, display: '10' };

    expect(calculatorReducer(state, { type: 'SELECT_OPERATION', operation: 'add' })).toEqual({
      phase: 'enteringSecond',
      display: '',
      storedOperand: 10,
      pendingOperation: 'add',
      error: null,
    });
  });

  it('handles calculation lifecycle actions', () => {
    const ready: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringSecond',
      display: '5',
      storedOperand: 10,
      pendingOperation: 'add',
    };

    expect(calculatorReducer(ready, { type: 'SQRT' })).toMatchObject({
      phase: 'loading',
      error: null,
    });

    expect(calculatorReducer(ready, { type: 'CALCULATION_START' })).toMatchObject({
      phase: 'loading',
      error: null,
    });

    expect(calculatorReducer(ready, { type: 'CALCULATION_SUCCESS', result: 15 })).toEqual({
      phase: 'resultShown',
      display: '15',
      storedOperand: null,
      pendingOperation: null,
      error: null,
    });
  });

  it('resumes the correct phase after calculation errors', () => {
    const enteringSecond: CalculatorState = {
      ...initialCalculatorState,
      phase: 'loading',
      display: '5',
      storedOperand: 10,
      pendingOperation: 'add',
    };
    expect(calculatorReducer(enteringSecond, { type: 'CALCULATION_ERROR', message: 'fail' })).toMatchObject({
      phase: 'enteringSecond',
      error: 'fail',
    });

    const afterResult: CalculatorState = {
      phase: 'resultShown',
      display: '15',
      storedOperand: null,
      pendingOperation: null,
      error: null,
    };
    expect(calculatorReducer(afterResult, { type: 'CALCULATION_ERROR', message: 'fail' })).toMatchObject({
      phase: 'resultShown',
      error: 'fail',
    });

    const enteringFirst: CalculatorState = {
      ...initialCalculatorState,
      phase: 'loading',
      display: '5',
      storedOperand: null,
      pendingOperation: 'add',
    };
    expect(calculatorReducer(enteringFirst, { type: 'CALCULATION_ERROR', message: 'fail' })).toMatchObject({
      phase: 'enteringFirst',
      error: 'fail',
    });
  });
});

describe('buildCalculateRequest', () => {
  it('builds a binary request when the second operand is valid', () => {
    const state: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringSecond',
      display: '5',
      storedOperand: 10,
      pendingOperation: 'add',
    };

    expect(buildCalculateRequest(state)).toEqual({
      request: { operation: 'add', operands: [10, 5] },
      error: null,
    });
  });

  it('returns errors when nothing can be calculated', () => {
    expect(buildCalculateRequest(initialCalculatorState)).toEqual({
      request: null,
      error: 'Nothing to calculate.',
    });

    const missingSecond: CalculatorState = {
      ...initialCalculatorState,
      phase: 'enteringSecond',
      display: '.',
      storedOperand: 10,
      pendingOperation: 'add',
    };
    expect(buildCalculateRequest(missingSecond)).toEqual({
      request: null,
      error: 'Enter the second number.',
    });
  });
});

describe('buildSqrtRequest', () => {
  it('builds a sqrt request for a valid display value', () => {
    const state: CalculatorState = { ...initialCalculatorState, display: '16' };
    expect(buildSqrtRequest(state)).toEqual({
      request: { operation: 'sqrt', operands: [16] },
      error: null,
    });
  });

  it('returns an error when the display is not a valid number', () => {
    const state: CalculatorState = { ...initialCalculatorState, display: '.' };
    expect(buildSqrtRequest(state)).toEqual({
      request: null,
      error: 'Enter a valid number first.',
    });
  });
});
