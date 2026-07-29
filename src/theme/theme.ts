import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (theme: 'dark' | 'light') => {
  return createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#0000f4', // --accent
      },
      secondary: {
        main: theme === 'dark' ? '#57dcff' : '#5f8eff', // --hero-accent / --hero-accent (light)
      },
      background: {
        default: theme === 'dark' ? '#0B0F19' : '#FEFCFF',
        paper: theme === 'dark' ? '#0b1018' : '#ffffff',
      },
      text: {
        primary: theme === 'dark' ? '#f5f7fb' : '#16243d',
        secondary: theme === 'dark' ? '#9aa4b3' : '#66758d',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Segoe UI", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '999px',
            textTransform: 'none',
            fontFamily: '"Poppins", "Segoe UI", sans-serif',
            fontWeight: 600,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '22px',
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};
