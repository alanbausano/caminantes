import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC107', // Golden Cheese Yellow
      light: '#FFD54F',
      dark: '#FFA000',
    },
    secondary: {
      main: '#FF9800', // Orange as a secondary accent 
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#0A0A0A', 
      paper: '#141414',   
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontWeight: 800, 
    },
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400, 
    },
    body2: {
      fontWeight: 400,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 700, 
      textTransform: 'none',
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8, // Reduced border radius for components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28, // Keeping buttons round per request
          padding: '12px 28px',
          boxShadow: 'none',
          color: '#1A1A1A', // Dark text on yellow button looks better
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(255, 193, 7, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FFC107 30%, #FFD54F 90%)',
          border: 0,
          color: '#1A1A1A', // Ensure text is dark and readable
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Reduced border radius
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Reduced border radius
        }
      }
    }
  },
});

export default theme;
