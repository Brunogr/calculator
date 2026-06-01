import { describe, expect, it } from 'vitest';
import { keyboardEventToKeypadKey } from './keyboardShortcuts';

function keyEvent(key: string, overrides: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return { key, ctrlKey: false, metaKey: false, altKey: false, ...overrides } as KeyboardEvent;
}

describe('keyboardEventToKeypadKey', () => {
  it('maps digits and operators', () => {
    expect(keyboardEventToKeypadKey(keyEvent('5'))).toBe('5');
    expect(keyboardEventToKeypadKey(keyEvent('.'))).toBe('.');
    expect(keyboardEventToKeypadKey(keyEvent(','))).toBe('.');
    expect(keyboardEventToKeypadKey(keyEvent('+'))).toBe('add');
    expect(keyboardEventToKeypadKey(keyEvent('-'))).toBe('subtract');
    expect(keyboardEventToKeypadKey(keyEvent('*'))).toBe('multiply');
    expect(keyboardEventToKeypadKey(keyEvent('/'))).toBe('divide');
    expect(keyboardEventToKeypadKey(keyEvent('%'))).toBe('percentage');
    expect(keyboardEventToKeypadKey(keyEvent('^'))).toBe('power');
    expect(keyboardEventToKeypadKey(keyEvent('Enter'))).toBe('=');
    expect(keyboardEventToKeypadKey(keyEvent('='))).toBe('=');
    expect(keyboardEventToKeypadKey(keyEvent('Backspace'))).toBe('backspace');
    expect(keyboardEventToKeypadKey(keyEvent('Escape'))).toBe('ce');
    expect(keyboardEventToKeypadKey(keyEvent('Delete'))).toBe('ce');
    expect(keyboardEventToKeypadKey(keyEvent('r'))).toBe('sqrt');
    expect(keyboardEventToKeypadKey(keyEvent('R'))).toBe('sqrt');
  });

  it('ignores modified and unhandled keys', () => {
    expect(keyboardEventToKeypadKey(keyEvent('5', { ctrlKey: true }))).toBeNull();
    expect(keyboardEventToKeypadKey(keyEvent('5', { metaKey: true }))).toBeNull();
    expect(keyboardEventToKeypadKey(keyEvent('5', { altKey: true }))).toBeNull();
    expect(keyboardEventToKeypadKey(keyEvent('Tab'))).toBeNull();
  });
});
