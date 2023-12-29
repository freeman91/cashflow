import React from 'react';
import { Outlet } from 'react-router';

import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  p: 3,
  width: { sm: `calc(100% - ${theme.drawerWidth}px)` },
}));

function MainContent() {
  return (
    <Main>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Outlet />
      </Box>
    </Main>
  );
}

export default MainContent;
