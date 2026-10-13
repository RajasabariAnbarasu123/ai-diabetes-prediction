import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
      contrastText: '#000000',
    },
    success: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },
    warning: { main: '#fbbf24', light: '#fde68a', dark: '#f59e0b' },
    error:   { main: '#f87171', light: '#fca5a5', dark: '#ef4444' },
    info:    { main: '#38bdf8', light: '#7dd3fc', dark: '#0ea5e9' },
    background: {
      default: '#0f172a',
      paper:   '#1e293b',
    },
    text: {
      primary:   '#f1f5f9',
      secondary: '#94a3b8',
      disabled:  '#475569',
    },
    divider: '#334155',
    action: {
      hover:    'rgba(129, 140, 248, 0.08)',
      selected: 'rgba(129, 140, 248, 0.12)',
      disabled: 'rgba(241, 245, 249, 0.26)',
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
    '0 1px 3px rgba(0,0,0,0.4)',
    '0 2px 6px rgba(0,0,0,0.4)',
    '0 4px 12px rgba(0,0,0,0.4)',
    '0 6px 18px rgba(0,0,0,0.45)',
    '0 8px 24px rgba(0,0,0,0.45)',
    '0 10px 30px rgba(0,0,0,0.5)',
    '0 12px 36px rgba(0,0,0,0.5)',
    '0 14px 42px rgba(0,0,0,0.5)',
    '0 16px 48px rgba(0,0,0,0.55)',
    '0 18px 54px rgba(0,0,0,0.55)',
    '0 20px 60px rgba(0,0,0,0.6)',
    '0 22px 66px rgba(0,0,0,0.6)',
    '0 24px 72px rgba(0,0,0,0.6)',
    '0 26px 78px rgba(0,0,0,0.65)',
    '0 28px 84px rgba(0,0,0,0.65)',
    '0 30px 90px rgba(0,0,0,0.7)',
    '0 32px 96px rgba(0,0,0,0.7)',
    '0 34px 102px rgba(0,0,0,0.7)',
    '0 36px 108px rgba(0,0,0,0.75)',
    '0 38px 114px rgba(0,0,0,0.75)',
    '0 40px 120px rgba(0,0,0,0.8)',
    '0 42px 126px rgba(0,0,0,0.8)',
    '0 44px 132px rgba(0,0,0,0.8)',
    '0 46px 138px rgba(0,0,0,0.85)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { scrollbarWidth: 'thin', scrollbarColor: '#334155 #0f172a' },
        '*::-webkit-scrollbar': { width: '6px', height: '6px' },
        '*::-webkit-scrollbar-track': { background: '#0f172a' },
        '*::-webkit-scrollbar-thumb': { background: '#334155', borderRadius: '8px' },
        '*::-webkit-scrollbar-thumb:hover': { background: '#475569' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 #334155',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid #334155',
        },
        elevation1: { boxShadow: '0 2px 8px rgba(0,0,0,0.4)' },
        elevation2: { boxShadow: '0 4px 16px rgba(0,0,0,0.45)' },
        elevation3: { boxShadow: '0 8px 24px rgba(0,0,0,0.5)' },
        elevation6: { boxShadow: '0 12px 36px rgba(0,0,0,0.55)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'none',
          border: '1px solid #334155',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
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
        contained: { boxShadow: '0 4px 14px rgba(129,140,248,0.35)' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          boxShadow: '0 4px 14px rgba(129,140,248,0.4)',
          '&:hover': { boxShadow: '0 6px 20px rgba(129,140,248,0.5)' },
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
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(129,140,248,0.2)' },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
        notchedOutline: { borderColor: '#334155', borderWidth: '1.5px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 8 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { '& .MuiTableCell-head': { fontWeight: 700, background: '#1e293b', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: 'rgba(129,140,248,0.05)' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderColor: '#334155', padding: '14px 16px' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, border: '1px solid #334155', backgroundImage: 'none' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, backgroundColor: '#334155' },
        bar: { borderRadius: 4 },
      },
    },
    MuiSkeleton: {
      styleOverrides: { root: { backgroundColor: '#334155' } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, backgroundColor: '#1e293b', border: '1px solid #334155' },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#334155' } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12, border: '1px solid' } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundImage: 'none', border: 'none', backgroundColor: '#0f172a' },
      },
    },
  },
});

export default darkTheme;