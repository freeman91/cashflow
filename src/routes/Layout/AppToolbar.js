import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useTheme } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';

function AppToolbar(props) {
  const { mobileOpen, setMobileOpen } = props;
  const location = useLocation();
  const theme = useTheme();

  const [pageName, setPageName] = useState('dashboard');

  useEffect(() => {
    let _pageName = '';
    if (location.pathname.startsWith('/app')) _pageName = 'dashboard';
    if (location.pathname.startsWith('/app/year')) _pageName = 'year';
    if (location.pathname.startsWith('/app/calendar')) _pageName = 'calendar';
    if (location.pathname.startsWith('/app/search')) _pageName = 'search';
    if (location.pathname.startsWith('/app/settings')) _pageName = 'settings';
    setPageName(_pageName);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        width: { sm: `calc(100% - ${theme.drawerWidth}px)` },
        ml: { sm: `${theme.drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' sx={{ fontWeight: 800 }}>
          {pageName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default AppToolbar;
