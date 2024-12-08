import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';

import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';

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
        pt: 0.5,
        pb: 1,
        px: 2,
        background: (theme) => theme.palette.surface[150],
        zIndex: 1,
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.surface[200],
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
        <BottomNavigationAction label='home' value='home' icon={<HomeIcon />} />
        <BottomNavigationAction
          label='accounts'
          value='accounts'
          icon={<AccountBalanceIcon />}
        />
        <BottomNavigationAction
          label='calendar'
          value='calendar'
          icon={<CalendarMonthIcon />}
        />
        <BottomNavigationAction
          label='summary'
          value='summary'
          icon={<AssessmentIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}

export default CustomBottomNavigation;
