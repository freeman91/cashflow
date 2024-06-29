import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import BackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { OPTIONS } from '.';
import { setAppBar, setHandleCreateClick } from '../../store/appSettings';

export const BackButton = (props) => {
  const { onClick } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(push('/dashboard'));
    }
  };

  return (
    <IconButton onClick={handleClick}>
      <BackIcon
        sx={{
          hieght: 25,
          width: 25,
          color: (theme) => theme.palette.primary.main,
        }}
      />
    </IconButton>
  );
};

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
          <IconButton edge='start' color='inherit' onClick={handleMenuClick}>
            <MenuIcon
              sx={{
                hieght: 25,
                width: 25,
                color: (theme) => theme.palette.primary.main,
              }}
            />
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
