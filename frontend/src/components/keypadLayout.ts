export type KeypadKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '.'
  | '='
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'sqrt'
  | 'percentage'
  | 'ce'
  | 'backspace';

export type KeypadCell = {
  key: KeypadKey;
  /** Number of columns to span in the 4-column grid (default 1). */
  colSpan?: number;
};

/** Rows for a fixed 4-column calculator grid. */
export const KEYPAD_GRID_ROWS: KeypadCell[][] = [
  [{ key: 'ce', colSpan: 2 }, { key: 'backspace', colSpan: 2 }],
  [{ key: '7' }, { key: '8' }, { key: '9' }, { key: 'divide' }],
  [{ key: '4' }, { key: '5' }, { key: '6' }, { key: 'multiply' }],
  [{ key: '1' }, { key: '2' }, { key: '3' }, { key: 'subtract' }],
  [{ key: '0' }, { key: '.' }, { key: '=' }, { key: 'add' }],
  [{ key: 'power' }, { key: 'sqrt' }, { key: 'percentage' }],
];
