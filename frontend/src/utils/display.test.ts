import { describe, expect, it } from 'vitest';
import { appendDecimal, appendDigit, backspaceDisplay, formatResult, parseDisplay } from './display';

describe('display utils', () => {
  it('parses valid numbers', () => {
    expect(parseDisplay('12.5')).toBe(12.5);
    expect(parseDisplay('')).toBeNull();
  });

  it('formats integer results without decimals', () => {
    expect(formatResult(15)).toBe('15');
  });

  it('appends digits and decimals safely', () => {
    expect(appendDigit('0', '5')).toBe('5');
    expect(appendDecimal('12')).toBe('12.');
    expect(appendDecimal('12.')).toBe('12.');
  });

  it('backspaces to zero when empty', () => {
    expect(backspaceDisplay('5')).toBe('0');
  });
});
