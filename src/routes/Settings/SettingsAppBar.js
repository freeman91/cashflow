import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { OPTIONS } from '.';
import { setAppBar, setHandleCreateClick } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';

export default function SettingsAppBar(props) {
  const { title, toggleTrigger } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(
      setAppBar({
        title: title.replace('_', ' '),
        leftAction: <BackButton />,
        rightAction: (
          <IconButton
            size='small'
            edge='start'
            color='inherit'
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
        ),
      })
    );
  }, [dispatch, title]);

  useEffect(() => {
    return () => {
      dispatch(setHandleCreateClick(null));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setHandleCreateClick(toggleTrigger));
  }, [dispatch, toggleTrigger]);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClick = (type) => {
    dispatch(push(`/settings/${type}`));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
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
  );
}
