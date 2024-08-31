import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';

function CustomBottomNavigation() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [pageName, setPageName] = useState('dashboard');

  useEffect(() => {
    let path = location.pathname.split('/');
    let _pageName = path[1];
    setPageName(_pageName);
  }, [location]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        pb: 2,
        px: 2,
        background: (theme) => theme.palette.surface[150],
        zIndex: 1,
      }}
    >
      <BottomNavigation
        value={pageName}
        sx={{ backgroundColor: 'unset' }}
        onChange={(e, value) => {
          if (value === null) return;
          dispatch(push(`/${value}`));
        }}
        showLabels
      >
        <BottomNavigationAction
          label='dashboard'
          value='dashboard'
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          label='year'
          value='year'
          icon={<CalendarTodayIcon />}
        />
        <BottomNavigationAction
          label='search'
          value='search'
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          label='settings'
          value='settings'
          icon={<MenuIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}

export default CustomBottomNavigation;
