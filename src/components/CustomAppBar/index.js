import React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import BackButton from './BackButton';
import LogoImg from './LogoImg';

const CustomAppBar = (props) => {
  const { left, middle, right } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AppBar
        position='fixed'
        sx={{
          boxShadow: 'unset',
          backgroundColor: 'unset',
          backgroundImage: 'unset',
          maxWidth: 500,
          top: 0,
          left: '50%',
          transform: 'translate(-50%, 0%)',
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.surface[200],
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: '42px',
            background: (theme) => theme.palette.surface[150],
          }}
        >
          {left ? left : <BackButton />}
          {middle ? middle : <LogoImg />}
          {right ? right : <Box width={35} height={35} />}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default CustomAppBar;
