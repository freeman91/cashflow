import React from 'react';
import { Outlet } from 'react-router';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import DesktopDrawer from './Drawer';
import Header from './Header';

export default function DesktopLayout({ children }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
      }}
    >
      <CssBaseline />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box
          component='nav'
          sx={{
            width: { sm: theme.drawerWidth },
            flexShrink: { sm: 0 },
          }}
        >
          <DesktopDrawer
            PaperProps={{
              sx: {
                width: theme.drawerWidth,
                marginTop: '65px',
              },
            }}
          />
        </Box>
        <Box component='main' sx={{ flex: 1, marginLeft: 25 }}>
          <Outlet />
        </Box>
      </Box>

      {children}
    </Box>
  );
}
