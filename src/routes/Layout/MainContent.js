import React from 'react';
import { Outlet } from 'react-router';

import styled from '@mui/material/styles/styled';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  p: 3,
  width: { sm: `calc(100% - ${theme.drawerWidth}px)` },
}));

function MainContent() {
  return (
    <Main>
      <Outlet />
    </Main>
  );
}

export default MainContent;
