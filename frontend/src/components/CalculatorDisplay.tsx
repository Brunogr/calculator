import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Phase } from '../types/calculator';

type CalculatorDisplayProps = {
  display: string;
  expressionHint: string;
  phase: Phase;
  error: string | null;
};

export function CalculatorDisplay({
  display,
  expressionHint,
  phase,
  error,
}: CalculatorDisplayProps) {
  const displayValue = display === '' ? '0' : display;

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        bgcolor: '#0a0c0f',
        border: 1,
        borderColor: 'grey.800',
      }}
    >
      <Stack spacing={0.75}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="right"
          aria-live="polite"
          sx={{
            minHeight: '1.25rem',
            visibility: expressionHint ? 'visible' : 'hidden',
          }}
        >
          {expressionHint || '\u00a0'}
        </Typography>
        <Typography
          variant="h4"
          align="right"
          aria-live="polite"
          aria-busy={phase === 'loading'}
          data-testid="calculator-display"
          sx={{
            wordBreak: 'break-all',
            fontWeight: 400,
            fontFamily: '"Roboto Mono", "Consolas", monospace',
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            lineHeight: 1.2,
            color: 'grey.100',
          }}
        >
          {displayValue}
        </Typography>
        {phase === 'loading' ? (
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}
            role="status"
          >
            <CircularProgress size={16} aria-hidden />
            <Typography variant="caption" color="text.secondary">
              Calculating…
            </Typography>
          </Box>
        ) : null}
        {error ? (
          <Alert severity="error" role="alert" sx={{ mt: 0.5, py: 0 }}>
            {error}
          </Alert>
        ) : null}
      </Stack>
    </Box>
  );
}
