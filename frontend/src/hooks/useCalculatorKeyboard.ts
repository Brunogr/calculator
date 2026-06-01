import { useEffect } from 'react';
import type { Operation } from '../types/calculator';
import type { CalculatorState } from '../types/calculator';
import { getKeypadButtonSpec } from '../components/keypadButtons';
import { keyboardEventToKeypadKey } from '../components/keyboardShortcuts';
import type { KeypadKey } from '../components/keypadLayout';

type CalculatorKeyboardHandlers = {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onSqrt: () => void;
  onBinaryOp: (operation: Operation) => void;
};

export function triggerKeypadKey(
  key: KeypadKey,
  state: CalculatorState,
  handlers: CalculatorKeyboardHandlers,
): boolean {
  const spec = getKeypadButtonSpec(key, state, handlers);
  if (spec.disabled) {
    return false;
  }
  spec.onClick();
  return true;
}

export function useCalculatorKeyboard(
  state: CalculatorState,
  handlers: CalculatorKeyboardHandlers,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      const keypadKey = keyboardEventToKeypadKey(event);
      if (!keypadKey) {
        return;
      }

      if (triggerKeypadKey(keypadKey, state, handlers)) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state, handlers, enabled]);
}
