import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useMediaQuery from '@mui/material/useMediaQuery';

import { getUser } from '../../store/user';
import Dialogs from './Dialogs';
import MobileLayout from './Mobile';
import DesktopLayout from './Desktop';

const USER_ID = process.env.REACT_APP_USER_ID;

function Layout() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getUser(USER_ID));
  }, [dispatch]);

  return isMobile ? (
    <MobileLayout>
      <Dialogs />
    </MobileLayout>
  ) : (
    <DesktopLayout>
      <Dialogs />
    </DesktopLayout>
  );
}

export default Layout;
