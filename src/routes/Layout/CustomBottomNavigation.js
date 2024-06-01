import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';
import includes from 'lodash/includes';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import MovingIcon from '@mui/icons-material/Moving';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { openDialog } from '../../store/dialogs';

const PAGE_TRANSACTIONS = {
  dashboard: ['expense', 'income', 'paycheck'],
  summary: ['expense', 'income', 'paycheck'],
  search: ['expense'],
  networth: [],
  settings: [],
  accounts: ['account'],
  assets: ['asset'],
  debts: ['debt'],
};

function PlusIconButton(props) {
  const { onClick } = props;
  return (
    <IconButton onClick={onClick} color='primary'>
      <AddCircleIcon sx={{ height: 50, width: 50 }} />
    </IconButton>
  );
}

function CustomBottomNavigation(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const [pageName, setPageName] = useState('dashboard');
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [attrs, setAttrs] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    let path = location.pathname.split('/');
    let _pageName = path[1];
    let options = Object.values(PAGE_TRANSACTIONS[_pageName]);
    let _attrs = null;

    if (_pageName === 'search') {
      const type = path[2];

      if (type === 'expenses') options = ['expense'];
      else if (type === 'incomes') options = ['income', 'paycheck'];
      else if (type === 'bills') options = ['bill'];
    }

    if (_pageName === 'accounts') {
      const accountId = path[2];
      if (accountId) {
        options = ['asset', 'debt'];
        _attrs = {
          account_id: accountId,
        };
      }
    }

    setTransactionTypes(options);
    setPageName(_pageName);
    setAttrs(_attrs);
  }, [location]);

  const handleClick = (event) => {
    if (transactionTypes.length === 1) {
      dispatch(
        openDialog({ type: transactionTypes[0], mode: 'create', attrs })
      );
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeClick = (type) => {
    dispatch(openDialog({ type, mode: 'create', attrs }));
    handleClose();
  };

  const open = Boolean(anchorEl);
  return (
    <Box
      sx={{
        display: includes(['settings'], pageName) ? 'none' : 'unset',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        pb: 2,
        backgroundColor: 'background.dark',
      }}
    >
      <BottomNavigation
        showLabels
        value={pageName}
        sx={{ backgroundColor: 'background.dark' }}
        onChange={(e, value) => {
          if (value === null) return;
          dispatch(push(`/${value}`));
        }}
      >
        <BottomNavigationAction
          label='dashboard'
          icon={<DashboardIcon />}
          value='dashboard'
        />
        <BottomNavigationAction
          label='summary'
          icon={<ReceiptIcon />}
          value='summary'
        />
        <PlusIconButton onClick={handleClick} />
        <BottomNavigationAction
          label='search'
          icon={<SearchIcon />}
          value='search'
        />
        <BottomNavigationAction
          label='networth'
          icon={<MovingIcon />}
          value='networth'
        />
      </BottomNavigation>
      <Menu
        anchorEl={anchorEl}
        id='transaction-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{ sx: { p: 0 } }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        {transactionTypes.map((type) => (
          <MenuItem key={type} onClick={() => handleTypeClick(type)}>
            {type}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default CustomBottomNavigation;
