import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { useTheme } from '@emotion/react';
import TollIcon from '@mui/icons-material/Toll';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

import { StyledTab, StyledTabs } from './StyledTabs';

const CustomAppBar = forwardRef((props, ref) => {
  const {
    title = null,
    rightIcon = null,
    tabs = null,
    tab = null,
    changeTab = null,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(push('/dashboard'));
  };

  const bgcolor = theme.palette.surface[150];
  return (
    <Box>
      <AppBar
        ref={ref}
        position='fixed'
        sx={{
          boxShadow: 'unset',
          backgroundColor: 'unset',
          backgroundImage: 'unset',
          width: '100%',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: '48px',
            background: bgcolor,
          }}
        >
          <IconButton size='large' edge='start' onClick={handleClick}>
            <TollIcon />
          </IconButton>
          {title}
          {rightIcon ? rightIcon : <Box sx={{ width: 35 }} />}
        </Toolbar>
        {tabs && (
          <StyledTabs
            variant='fullWidth'
            sx={{ pb: 1, background: bgcolor }}
            value={tab}
            onChange={changeTab}
          >
            {tabs.map((_tab) => (
              <StyledTab key={_tab} label={_tab} value={_tab} />
            ))}
          </StyledTabs>
        )}
        <Box
          sx={{
            height: '5px',
            background: `linear-gradient(${bgcolor}, transparent)`,
          }}
        />
      </AppBar>
    </Box>
  );
});

export default CustomAppBar;
