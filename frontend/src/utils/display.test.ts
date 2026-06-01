import { describe, expect, it } from 'vitest';
import { appendDecimal, appendDigit, backspaceDisplay, formatResult, parseDisplay } from './display';

describe('display utils', () => {
  it('parses valid numbers and rejects incomplete or non-finite values', () => {
    expect(parseDisplay('12.5')).toBe(12.5);
    expect(parseDisplay('')).toBeNull();
    expect(parseDisplay('-')).toBeNull();
    expect(parseDisplay('.')).toBeNull();
    expect(parseDisplay('  7  ')).toBe(7);
    expect(parseDisplay('NaN')).toBeNull();
    expect(parseDisplay('Infinity')).toBeNull();
  });

  it('formats integer and decimal results', () => {
    expect(formatResult(15)).toBe('15');
    expect(formatResult(1.23456789)).toBe('1.23456789');
  });

  it('appends digits and decimals safely', () => {
    expect(appendDigit('0', '5')).toBe('5');
    expect(appendDigit('', '5')).toBe('5');
    expect(appendDigit('12', '3')).toBe('123');
    expect(appendDecimal('12')).toBe('12.');
    expect(appendDecimal('12.')).toBe('12.');
    expect(appendDecimal('0')).toBe('0.');
    expect(appendDecimal('')).toBe('0.');
  });

  it('backspaces to zero when one character remains', () => {
    expect(backspaceDisplay('5')).toBe('0');
    expect(backspaceDisplay('123')).toBe('12');
  });
});
