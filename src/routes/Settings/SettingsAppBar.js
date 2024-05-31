import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { OPTIONS } from '.';

export default function SettingsAppBar(props) {
  const { title, toggleTrigger } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClick = (type) => {
    dispatch(push(`/settings/${type}`));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    dispatch(push('/dashboard'));
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar sx={{ minHeight: '50px' }}>
            <IconButton
              size='small'
              edge='start'
              color='inherit'
              onClick={handleBackClick}
              sx={{ mr: 1 }}
            >
              <DashboardIcon />
            </IconButton>
            <IconButton
              size='small'
              edge='start'
              color='inherit'
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuOpenIcon />
            </IconButton>
            <Typography variant='h6' sx={{ flexGrow: 1 }}>
              {title.replace('_', ' ')}
            </Typography>

            <IconButton size='small' color='primary' onClick={toggleTrigger}>
              <AddCircleIcon sx={{ height: 35, width: 35 }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='transaction-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{ sx: { p: 0 } }}
      >
        {Object.keys(OPTIONS).map((option) => {
          if (title === option) return null;
          return (
            <MenuItem key={option} onClick={() => handleClick(option)}>
              {option.replace('_', ' ')}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
