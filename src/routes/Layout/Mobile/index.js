import React from 'react';
import { Outlet } from 'react-router';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import MobileBottomNavigation from '../MobileBottomNavigation';
import CustomSnackbar from '../CustomSnackbar';

export default function MobileLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <CssBaseline />
      <Outlet />
      <MobileBottomNavigation />
      {children}
      <CustomSnackbar />
    </Box>
  );
}
