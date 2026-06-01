import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { CalculatorState } from '../types/calculator';
import type { Operation } from '../types/calculator';
import { getKeypadButtonSpec } from './keypadButtons';
import { KEYPAD_GRID_ROWS } from './keypadLayout';

type CalculatorKeypadProps = {
  state: CalculatorState;
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onSqrt: () => void;
  onBinaryOp: (operation: Operation) => void;
};

const GRID_COLUMNS = 4;

export function CalculatorKeypad({
  state,
  onDigit,
  onDecimal,
  onClear,
  onBackspace,
  onEquals,
  onSqrt,
  onBinaryOp,
}: CalculatorKeypadProps) {
  const handlers = {
    onDigit,
    onDecimal,
    onClear,
    onBackspace,
    onEquals,
    onSqrt,
    onBinaryOp,
  };

  return (
    <Box
      role="group"
      aria-label="Calculator keypad"
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
        gap: { xs: 1, sm: 1.25 },
        width: '100%',
      }}
    >
      {KEYPAD_GRID_ROWS.flatMap((row) =>
        row.map(({ key, colSpan = 1 }) => {
          const spec = getKeypadButtonSpec(key, state, handlers);
          const isAccent = spec.isOperator || spec.isEquals;

          return (
            <Button
              key={spec.ariaLabel}
              fullWidth
              disableElevation
              variant={spec.pressed || spec.isEquals ? 'contained' : 'text'}
              color={spec.isEquals ? 'primary' : spec.isOperator ? 'secondary' : 'inherit'}
              aria-label={spec.ariaLabel}
              aria-pressed={spec.pressed}
              disabled={spec.disabled}
              onClick={spec.onClick}
              sx={{
                gridColumn: `span ${Math.min(colSpan, GRID_COLUMNS)}`,
                minHeight: { xs: 48, sm: 52 },
                minWidth: 0,
                borderRadius: 2,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                fontWeight: isAccent ? 600 : 500,
                bgcolor: spec.pressed
                  ? 'secondary.main'
                  : spec.isEquals
                    ? 'primary.main'
                    : isAccent
                      ? 'action.selected'
                      : 'grey.800',
                color: spec.pressed || spec.isEquals ? 'primary.contrastText' : 'text.primary',
                border: 1,
                borderColor: isAccent ? 'secondary.dark' : 'grey.700',
                '&:hover': {
                  bgcolor: spec.isEquals
                    ? 'primary.dark'
                    : isAccent
                      ? 'action.focus'
                      : 'grey.700',
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.900',
                  color: 'text.disabled',
                  borderColor: 'grey.800',
                },
              }}
            >
              {spec.label}
            </Button>
          );
        }),
      )}
    </Box>
  );
}
