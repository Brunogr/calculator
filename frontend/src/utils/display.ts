export function parseDisplay(display: string): number | null {
  const trimmed = display.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '.') {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return null;
  }
  return value;
}

export function formatResult(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

export function appendDigit(display: string, digit: string): string {
  if (display === '' || display === '0') {
    return digit;
  }
  return display + digit;
}

export function appendDecimal(display: string): string {
  if (display.includes('.')) {
    return display;
  }
  if (display === '' || display === '0') {
    return '0.';
  }
  return `${display}.`;
}

export function backspaceDisplay(display: string): string {
  if (display.length <= 1) {
    return '0';
  }
  return display.slice(0, -1);
}
