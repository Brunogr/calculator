import type { KeypadKey } from './keypadLayout';

/** Maps a keyboard event to a calculator keypad key, or null if unhandled. */
export function keyboardEventToKeypadKey(event: KeyboardEvent): KeypadKey | null {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return null;
  }

  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    return key as KeypadKey;
  }
  if (key === '.' || key === ',') {
    return '.';
  }
  if (key === 'Enter' || key === '=') {
    return '=';
  }
  if (key === 'Backspace') {
    return 'backspace';
  }
  if (key === 'Escape' || key === 'Delete') {
    return 'ce';
  }
  if (key === '+') {
    return 'add';
  }
  if (key === '-') {
    return 'subtract';
  }
  if (key === '*') {
    return 'multiply';
  }
  if (key === '/') {
    return 'divide';
  }
  if (key === '%') {
    return 'percentage';
  }
  if (key === '^') {
    return 'power';
  }
  if (key === 'r' || key === 'R') {
    return 'sqrt';
  }

  return null;
}
