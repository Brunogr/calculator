import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CalculatorState } from '../types/calculator';
import { triggerKeypadKey, useCalculatorKeyboard } from './useCalculatorKeyboard';
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

describe('triggerKeypadKey', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns false and skips handlers for disabled keys', () => {
    const loading: CalculatorState = { ...initialCalculatorState, phase: 'loading' };

    expect(triggerKeypadKey('5', loading, handlers)).toBe(false);
    expect(handlers.onDigit).not.toHaveBeenCalled();
  });

  it('invokes the enabled key handler and returns true', () => {
    expect(triggerKeypadKey('5', initialCalculatorState, handlers)).toBe(true);
    expect(handlers.onDigit).toHaveBeenCalledWith('5');
  });
});

describe('useCalculatorKeyboard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles keyboard events for enabled keys', () => {
    renderHook(() => useCalculatorKeyboard(initialCalculatorState, handlers));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }));

    expect(handlers.onDigit).toHaveBeenCalledWith('5');
  });

  it('ignores keyboard events when disabled', () => {
    renderHook(() => useCalculatorKeyboard(initialCalculatorState, handlers, false));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }));

    expect(handlers.onDigit).not.toHaveBeenCalled();
  });

  it('ignores keyboard events from form controls', () => {
    renderHook(() => useCalculatorKeyboard(initialCalculatorState, handlers));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }));

    expect(handlers.onDigit).not.toHaveBeenCalled();
    input.remove();
  });

  it('ignores unmapped keyboard events', () => {
    renderHook(() => useCalculatorKeyboard(initialCalculatorState, handlers));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(handlers.onDigit).not.toHaveBeenCalled();
  });
});
