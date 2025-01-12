import { createTheme } from '@mui/material/styles';

const PRIMARY = '#7373ff';
const GREEN = '#3caa57';
const YELLOW = '#C7EA46';
const RED = '#f44336';
const ORANGE = '#d4952e';

export const breakpoints = {
  xs: 0,
  sm: 500,
  md: 960,
  lg: 1280,
  xl: 1920,
};

const PALETTE = {
  primary: { main: PRIMARY },
  success: { main: GREEN },
  // info: { main: 'rgba(255, 255, 255, 0.7)' },
  orange: { main: ORANGE },
  yellow: { main: YELLOW },
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
  green: {
    100: '#d9ebdd',
    200: '#85c093',
    300: '#55a368',
    400: GREEN,
  },
  red: {
    100: '#996666',
    200: '#ac5353',
    300: '#b64949',
    400: RED,
    500: '#ca3535',
    600: '#d42b2b',
  },
};

export const muiTheme = createTheme({
  colorSchemes: {
    dark: { palette: PALETTE },
    light: { palette: PALETTE },
  },
  cssVariables: {
    colorSchemeSelector: 'class',
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
  },
  drawerWidth: 200,
  appBar: {
    mobile: {
      height: '42px',
    },
    desktop: {
      height: '56px',
    },
  },
  chartColors: [
    '#6633FF', // dark blue
    PRIMARY, // blue
    '#0099FF', // light blue
    '#006633', // dark green
    GREEN, // green
    '#9DC183', // light green
    '#E4CD05', // dark yellow
    YELLOW, // yellow
    '#FCF4A3', // light yellow
    '#d32f2f', // dark red
    RED, // red
    '#e57373', // light red
    'rgb(148, 104, 32)', // dark orange
    ORANGE, // orange
    'rgb(220, 170, 87)', // light orange
    '#FC0FC0', // pink
    '#7C4700', // brown
    '#B200ED', // purple
  ],
});
