import React from 'react';
import { Outlet } from 'react-router';

import { alpha } from '@mui/material/styles';
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
      <Box
        component='nav'
        sx={{ width: { sm: theme.drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <DesktopDrawer
          PaperProps={{
            sx: {
              width: theme.drawerWidth,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component='main' sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
      {children}
    </Box>
  );
}
