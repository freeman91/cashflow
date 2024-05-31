import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const OPTIONS = ['accounts', 'assets', 'debts'];

export default function PageSelect(props) {
  const { options = OPTIONS } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (type) => {
    dispatch(push(`/${type}`));
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <IconButton
        size='small'
        edge='start'
        color='inherit'
        onClick={handleMenuClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='transaction-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{ sx: { p: 0 } }}
      >
        {options.map((option) => {
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
