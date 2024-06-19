import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import FilterListIcon from '@mui/icons-material/FilterList';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { OPTIONS } from '.';
import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';

export default function SearchAppBar(props) {
  const { title, toggleTrigger } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(
      setAppBar({
        title,
        leftAction: <BackButton />,
        rightAction: (
          <>
            <IconButton
              size='small'
              edge='end'
              color='inherit'
              onClick={toggleTrigger}
              sx={{ mr: 3 }}
            >
              <FilterListIcon />
            </IconButton>
            <IconButton
              size='small'
              edge='start'
              color='inherit'
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
          </>
        ),
      })
    );
  }, [dispatch, title, toggleTrigger]);

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
  const options = Object.keys(OPTIONS);
  const availableOptions = options.filter((option) => option !== title);
  return (
    <Menu
      anchorEl={anchorEl}
      id='transaction-menu'
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      MenuListProps={{ sx: { p: 0 } }}
    >
      {availableOptions.map((option, idx) => {
        return [
          <MenuItem
            key={option}
            onClick={() => handleClick(option)}
            sx={{ p: 2 }}
          >
            <Typography variant='h6'>{option}</Typography>
          </MenuItem>,
          idx !== availableOptions.length - 1 ? <Divider /> : null,
        ];
      })}
    </Menu>
  );
}
