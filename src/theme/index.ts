import { createTheme, type PaletteMode } from '@mui/material/styles';

const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#6366f1',
              light: '#818cf8',
              dark: '#4f46e5',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#0ea5e9',
              light: '#38bdf8',
              dark: '#0284c7',
            },
            success: {
              main: '#22c55e',
              light: '#4ade80',
              dark: '#16a34a',
            },
            warning: {
              main: '#f59e0b',
              light: '#fbbf24',
              dark: '#d97706',
            },
            error: {
              main: '#ef4444',
              light: '#f87171',
              dark: '#dc2626',
            },
            background: {
              default: '#f8fafc',
              paper: '#ffffff',
            },
            text: {
              primary: '#1e293b',
              secondary: '#64748b',
            },
            divider: '#e2e8f0',
          }
        : {
            primary: {
              main: '#818cf8',
              light: '#a5b4fc',
              dark: '#6366f1',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#38bdf8',
              light: '#7dd3fc',
              dark: '#0ea5e9',
            },
            success: {
              main: '#4ade80',
              light: '#86efac',
              dark: '#22c55e',
            },
            warning: {
              main: '#fbbf24',
              light: '#fcd34d',
              dark: '#f59e0b',
            },
            error: {
              main: '#f87171',
              light: '#fca5a5',
              dark: '#ef4444',
            },
            background: {
              default: '#0f172a',
              paper: '#1e293b',
            },
            text: {
              primary: '#f1f5f9',
              secondary: '#94a3b8',
            },
            divider: '#334155',
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.25rem' },
      h2: { fontWeight: 700, fontSize: '1.875rem' },
      h3: { fontWeight: 600, fontSize: '1.5rem' },
      h4: { fontWeight: 600, fontSize: '1.25rem' },
      h5: { fontWeight: 600, fontSize: '1.125rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontWeight: 500, fontSize: '1rem' },
      subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
      body1: { fontSize: '0.875rem' },
      body2: { fontSize: '0.8125rem' },
      button: { fontWeight: 600, textTransform: 'none' as const },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light'
              ? '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.3)',
            border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}`,
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 16px', fontWeight: 600 },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
          },
        },
      },
      MuiTextField: {
        styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } } },
      MuiTableCell: {
        styleOverrides: { root: { borderColor: mode === 'light' ? '#e2e8f0' : '#334155' } },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}` },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
            color: mode === 'light' ? '#1e293b' : '#f1f5f9',
          },
        },
      },
    },
  });

export default getTheme;
