import { createTheme } from '@mui/material/styles';

// Dog-friendly color palette
const THEME = {
  primary: '#4A6FA5', // A friendly blue
  secondary: '#FF9D6E', // Warm orange (like a golden retriever)
  accent: '#6B8F71', // Forest green (for outdoor/nature feel)
  error: '#D64045',
  success: '#5B8C5A',
  background: '#F9F7F3', // Soft cream background
  cardBg: '#FFFFFF',
  text: '#333333',
  lightText: '#666666',
  shadow: 'rgba(0,0,0,0.08)',
  pawPrint: '#E6E6E6', // Light gray for paw print patterns
};

// Create a theme instance based on our dog-friendly palette
const theme = createTheme({
  palette: {
    primary: {
      main: THEME.primary,
    },
    secondary: {
      main: THEME.secondary,
    },
    error: {
      main: THEME.error,
    },
    success: {
      main: THEME.success,
    },
    background: {
      default: THEME.background,
      paper: THEME.cardBg,
    },
    text: {
      primary: THEME.text,
      secondary: THEME.lightText,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners for a friendly feel
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif', // Nunito is a friendly, rounded font
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // More friendly, less shouty buttons
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25, // Pill-shaped buttons
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s',
          },
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 4px 8px rgba(74, 111, 165, 0.2)',
          },
        },
        containedSecondary: {
          '&:hover': {
            boxShadow: '0 4px 8px rgba(255, 157, 110, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: `0 8px 16px ${THEME.shadow}`,
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 12px 20px ${THEME.shadow}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;
