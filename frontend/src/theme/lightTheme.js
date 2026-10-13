import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
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
      contrastText: '#ffffff',
    },
    success: { main: '#10b981', light: '#34d399', dark: '#059669' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    error:   { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    info:    { main: '#0ea5e9', light: '#38bdf8', dark: '#0284c7' },
    background: {
      default: '#f8fafc',
      paper:   '#ffffff',
    },
    text: {
      primary:   '#0f172a',
      secondary: '#64748b',
      disabled:  '#94a3b8',
    },
    divider: '#e2e8f0',
    action: {
      hover:    'rgba(99, 102, 241, 0.06)',
      selected: 'rgba(99, 102, 241, 0.10)',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 700, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
    '0 2px 6px rgba(15,23,42,0.07), 0 1px 3px rgba(15,23,42,0.05)',
    '0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)',
    '0 6px 18px rgba(15,23,42,0.09)',
    '0 8px 24px rgba(15,23,42,0.10)',
    '0 10px 30px rgba(15,23,42,0.11)',
    '0 12px 36px rgba(15,23,42,0.12)',
    '0 14px 42px rgba(15,23,42,0.12)',
    '0 16px 48px rgba(15,23,42,0.13)',
    '0 18px 54px rgba(15,23,42,0.13)',
    '0 20px 60px rgba(15,23,42,0.14)',
    '0 22px 66px rgba(15,23,42,0.14)',
    '0 24px 72px rgba(15,23,42,0.15)',
    '0 26px 78px rgba(15,23,42,0.15)',
    '0 28px 84px rgba(15,23,42,0.16)',
    '0 30px 90px rgba(15,23,42,0.16)',
    '0 32px 96px rgba(15,23,42,0.17)',
    '0 34px 102px rgba(15,23,42,0.17)',
    '0 36px 108px rgba(15,23,42,0.18)',
    '0 38px 114px rgba(15,23,42,0.18)',
    '0 40px 120px rgba(15,23,42,0.19)',
    '0 42px 126px rgba(15,23,42,0.19)',
    '0 44px 132px rgba(15,23,42,0.20)',
    '0 46px 138px rgba(15,23,42,0.20)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' },
        '*::-webkit-scrollbar': { width: '6px', height: '6px' },
        '*::-webkit-scrollbar-track': { background: '#f1f5f9' },
        '*::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '8px' },
        '*::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(248, 250, 252, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 #e2e8f0',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
        },
        elevation1: { boxShadow: '0 2px 8px rgba(15,23,42,0.07)' },
        elevation2: { boxShadow: '0 4px 16px rgba(15,23,42,0.08)' },
        elevation3: { boxShadow: '0 6px 24px rgba(15,23,42,0.09)' },
        elevation6: { boxShadow: '0 12px 36px rgba(15,23,42,0.12)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'none',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(15,23,42,0.07)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(15,23,42,0.12)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: '24px', '&:last-child': { paddingBottom: '24px' } } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.4)' },
        },
        outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.2s ease',
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
        notchedOutline: { borderColor: '#e2e8f0', borderWidth: '1.5px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 8 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { '& .MuiTableCell-head': { fontWeight: 700, background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: 'rgba(99,102,241,0.04)' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderColor: '#f1f5f9', padding: '14px 16px' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, border: '1px solid #e2e8f0' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, backgroundColor: '#e2e8f0' },
        bar: { borderRadius: 4 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, backgroundColor: '#0f172a' },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#e2e8f0' } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12, border: '1px solid' } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundImage: 'none', border: 'none' },
      },
    },
  },
});

export default lightTheme;