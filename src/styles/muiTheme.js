import { createTheme } from '@mui/material/styles';

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
    surface: {
      100: '#121212',
      150: '#1b1b1b',
      200: '#282828',
      250: '#2b2b2b',
      300: '#3f3f3f',
      400: '#575757',
      500: '#717171',
      600: '#8b8b8b',
    },
    primary: { main: '#7373ff' },
    secondary: { main: '#3caa57' },
    green: {
      100: '#d9ebdd',
      200: '#85c093',
      300: '#55a368',
      400: '#3caa57',
      chart: {
        veregy: '#3caa57',
        'together & compoany': '#29ab87',
        tips: '#4cbb17',
        refund: '#d0f0c0',
        other: '#98fb98',
        sale: '#9dc183',
        gift: '#2e8b57',
      },
    },
    red: {
      100: '#996666',
      200: '#ac5353',
      300: '#b64949',
      400: '#c03f3f',
      500: '#ca3535',
      600: '#d42b2b',
    },
    grey: {
      0: '#f3f3f3',
      10: '#c6c6c6',
      20: '#919191',
      30: '#5e5e5e',
      40: '#303030',
    },
    black: '#282828',
    jet: '#303036',
    danger: { main: '#c03f3f', secondary: '#d6726b' },
    success: { main: '#3caa57' },
    warning: { main: '#d4952e' },
    info: { main: '#5c98fb' },
    button: 'rgba(255, 255, 255, 0.7)',
  },
  typography: {
    fontFamily: '"Arial", "Helvetica", sans-serif',
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
  chartColors: {
    housing: '#006633',
    utility: '#CCCC33',
    food: '#00CC66',
    transportation: '#CC6600',
    health: '#0099FF',
    entertainment: '#666666',
    project: '#FF6633',
    shopping: '#FFFF00',
    travel: '#6633FF',
    other: ' 	#808080',
  },
});
