import { createTheme } from '@mui/material/styles';
import {
  grey,
  blue,
  green,
  red,
  yellow,
  orange,
  purple,
} from '@mui/material/colors';

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
    orange,
    purple,
    black: '#121212',
  },
  typography: {
    fontFamily: '"Helvetica", "Arial", sans-serif',
    defaultFontSize: '0.875rem',
    button: {
      textTransform: 'none',
    },
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: breakpoints,
    maxWidth: 1000,
  },
  drawerWidth: 175,
  chartColors: [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#54426B',
    '#767522',
    '#81C14B',
  ],
});
