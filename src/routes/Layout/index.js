import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import LinearProgress from '@mui/material/LinearProgress';

import { getUser } from '../../store/user';
import CustomAppBar from './CustomAppBar';
import CustomDrawer from './CustomDrawer';
import ItemView from './ItemView';
import CustomSnackbar from './CustomSnackbar';

const USER_ID = process.env.REACT_APP_USER_ID;

function Layout() {
  const toolbarRef = useRef();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const loading = useSelector((state) => state.appSettings.loading);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(true);

  useEffect(() => {
    dispatch(getUser(USER_ID));
  }, [dispatch]);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const marginTop = toolbarRef?.current?.offsetHeight || 64;
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
      }}
    >
      {loading > 0 && (
        <Box
          sx={{
            width: '100%',
            position: 'absolute',
            height: 5,
            zIndex: 1500,
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <CssBaseline />
      <CustomAppBar
        ref={toolbarRef}
        drawerExpanded={drawerExpanded}
        setDrawerExpanded={setDrawerExpanded}
        setMobileOpen={setMobileOpen}
      />
      <CustomDrawer
        drawerExpanded={drawerExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Box component='main' sx={{ mt: marginTop + 'px', width: '100%' }}>
        <Outlet context={{ toolbarRef }} />
      </Box>
      <ItemView />
      <CustomSnackbar />
    </Box>
  );
}

export default Layout;
