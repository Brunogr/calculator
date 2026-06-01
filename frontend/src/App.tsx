import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Calculator } from './components/Calculator';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0f12',
      paper: '#1a1d24',
    },
    primary: {
      main: '#3d8bfd',
    },
    secondary: {
      main: '#9b6dff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 1.5, sm: 2 },
          py: { xs: 2, sm: 3 },
          bgcolor: 'background.default',
        }}
      >
        <Calculator />
      </Box>
    </ThemeProvider>
  );
}
