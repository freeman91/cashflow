import { createMuiTheme } from '@material-ui/core/styles';

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const muiTheme = createMuiTheme({
  palette: {
    type: 'dark',
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
  },
  drawerWidth: 150,
});
