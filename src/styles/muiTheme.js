import { createTheme } from '@mui/material/styles';
import { grey, blue, green, red, yellow } from '@mui/material/colors';

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    grey,
    blue,
    green,
    red,
    yellow,
    black: '#121212',
  },
  typography: {
    fontFamily: '"Helvetica", "Arial", sans-serif',
    fontSize: 12,
    fontWeightLight: 100,
    fontWeightRegular: 200,
    fontWeightMedium: 300,
    useNextVariants: true,
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: breakpoints,
    maxWidth: 1000,
  },
  drawerWidth: 150,
});
