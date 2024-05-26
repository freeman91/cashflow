import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import MovingIcon from '@mui/icons-material/Moving';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

function CustomBottomNavigation(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const [pageName, setPageName] = useState('dashboard');

  useEffect(() => {
    let _pageName = location.pathname.split('/')[1];
    setPageName(_pageName);
  }, [location]);

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <Divider />
      <BottomNavigation
        showLabels
        sx={{ bgcolor: '#121212' }}
        value={pageName}
        onChange={(e, value) => {
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
        <BottomNavigationAction icon={<AddCircleIcon fontSize='large' />} />
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
    </Box>
  );
}

export default CustomBottomNavigation;
