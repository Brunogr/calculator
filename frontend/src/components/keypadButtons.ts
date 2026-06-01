import type { Operation } from '../types/calculator';
import { BINARY_OPERATIONS, OPERATION_LABELS } from '../types/calculator';
import type { CalculatorState } from '../types/calculator';
import {
  isBinaryOpDisabled,
  isClearDisabled,
  isDigitDisabled,
  isEqualsDisabled,
  isSelectedOperation,
  isSqrtDisabled,
} from '../utils/calculatorState';
import type { KeypadKey } from './keypadLayout';

export type KeypadButtonSpec = {
  key: KeypadKey;
  label: string;
  ariaLabel: string;
  disabled: boolean;
  pressed: boolean;
  isOperator: boolean;
  isEquals: boolean;
};

type KeypadHandlers = {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onSqrt: () => void;
  onBinaryOp: (operation: Operation) => void;
};

export function getKeypadButtonSpec(
  key: KeypadKey,
  state: CalculatorState,
  handlers: KeypadHandlers,
): KeypadButtonSpec & { onClick: () => void } {
  if (key === 'ce') {
    return {
      key,
      label: 'CE',
      ariaLabel: 'Clear entry',
      disabled: isClearDisabled(state),
      pressed: false,
      isOperator: false,
      isEquals: false,
      onClick: handlers.onClear,
    };
  }
  if (key === 'backspace') {
    return {
      key,
      label: '⌫',
      ariaLabel: 'Backspace',
      disabled: isDigitDisabled(state),
      pressed: false,
      isOperator: false,
      isEquals: false,
      onClick: handlers.onBackspace,
    };
  }
  if (key === '.') {
    return {
      key,
      label: '.',
      ariaLabel: 'Decimal',
      disabled: isDigitDisabled(state),
      pressed: false,
      isOperator: false,
      isEquals: false,
      onClick: handlers.onDecimal,
    };
  }
  if (key === '=') {
    return {
      key,
      label: '=',
      ariaLabel: 'Equals',
      disabled: isEqualsDisabled(state),
      pressed: false,
      isOperator: false,
      isEquals: true,
      onClick: handlers.onEquals,
    };
  }
  if (key === 'sqrt') {
    return {
      key,
      label: '√',
      ariaLabel: 'Square root',
      disabled: isSqrtDisabled(state),
      pressed: false,
      isOperator: false,
      isEquals: false,
      onClick: handlers.onSqrt,
    };
  }
  if (BINARY_OPERATIONS.includes(key as Operation)) {
    const operation = key as Operation;
    return {
      key,
      label: OPERATION_LABELS[operation],
      ariaLabel: OPERATION_LABELS[operation],
      disabled: isBinaryOpDisabled(state, operation),
      pressed: isSelectedOperation(state, operation),
      isOperator: true,
      isEquals: false,
      onClick: () => handlers.onBinaryOp(operation),
    };
  }
  if (/^\d$/.test(key)) {
    return {
      key,
      label: key,
      ariaLabel: key,
      disabled: isDigitDisabled(state),
      pressed: false,
      isOperator: false,
      isEquals: false,
      onClick: () => handlers.onDigit(key),
    };
  }
  return {
    key,
    label: key,
    ariaLabel: key,
    disabled: true,
    pressed: false,
    isOperator: false,
    isEquals: false,
    onClick: () => undefined,
  };
}
