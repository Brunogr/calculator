export type Operation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'sqrt'
  | 'percentage';

export type CalculateRequest = {
  operation: Operation;
  operands: number[];
};

export type CalculateResponse = {
  result: number;
};

export type ApiErrorCode =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_OPERATION'
  | 'INVALID_OPERAND_COUNT'
  | 'INVALID_OPERAND'
  | 'DIVISION_BY_ZERO'
  | 'NEGATIVE_SQRT'
  | 'METHOD_NOT_ALLOWED'
  | 'INTERNAL_ERROR';

export type CalculateErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

export type Phase = 'enteringFirst' | 'enteringSecond' | 'resultShown' | 'loading';

export type CalculatorState = {
  phase: Phase;
  display: string;
  storedOperand: number | null;
  pendingOperation: Operation | null;
  error: string | null;
};

export const BINARY_OPERATIONS: Operation[] = [
  'add',
  'subtract',
  'multiply',
  'divide',
  'power',
  'percentage',
];

export const OPERATION_LABELS: Record<Operation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: 'xʸ',
  sqrt: '√',
  percentage: '%',
};
