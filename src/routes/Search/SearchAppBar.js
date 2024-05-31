import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import FilterListIcon from '@mui/icons-material/FilterList';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { OPTIONS } from '.';

export default function SearchAppBar(props) {
  const { title, toggleTrigger } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (type) => {
    dispatch(push(`/search/${type}`));
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar sx={{ minHeight: '40px' }}>
            <IconButton
              size='small'
              edge='start'
              color='inherit'
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              align='center'
              variant='h6'
              sx={{ flexGrow: 1, fontWeight: 800 }}
            >
              {title}
            </Typography>

            <IconButton
              size='small'
              edge='end'
              color='inherit'
              onClick={toggleTrigger}
            >
              <FilterListIcon />
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
              {option}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
