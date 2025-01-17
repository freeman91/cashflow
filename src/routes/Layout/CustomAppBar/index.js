import React, { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import startCase from 'lodash/startCase';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoopIcon from '@mui/icons-material/Loop';
import MenuIcon from '@mui/icons-material/Menu';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@mui/material/styles/styled';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { getUser } from '../../../store/user';
import ReactiveButton from '../../../components/ReactiveButton';
import AccountsAppBar from './AccountsAppBar';
import TransactionsAppBar from './TransactionsAppBar';

const DASHBOARD = 'dashboard';
const REPORTS = 'reports';
const BUDGETS = 'budgets';
const SETTINGS = 'settings';
const PROFILE = 'profile';
const ROUTES = [DASHBOARD, REPORTS, BUDGETS, SETTINGS, PROFILE];

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => !['expanded', 'drawerWidth'].includes(prop),
})(({ expanded, theme, drawerWidth }) => ({
  boxShadow: 'unset',
  backgroundImage: 'unset',
  [theme.breakpoints.up('md')]: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: expanded
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
  },
}));

const DrawerToggleButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(0),
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.down('md')]: {
    marginLeft: '-4px',
  },
}));

const CustomAppBar = forwardRef((props, ref) => {
  const { drawerExpanded, setDrawerExpanded, setMobileOpen } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const user = useSelector((state) => state.user.item);
  const [route, setRoute] = useState('dashboard');

  useEffect(() => {
    const _route = location.pathname.split('/')[1];
    setRoute(_route);
  }, [location]);

  const toggleMenu = () => {
    if (isMobile) setMobileOpen((currentOpen) => !currentOpen);
    else setDrawerExpanded((currentExpanded) => !currentExpanded);
  };

  const handleRefresh = () => {
    dispatch(getUser(user.user_id));
  };

  const drawerWidth = drawerExpanded ? theme.drawerWidth : 0;
  return (
    <StyledAppBar
      ref={ref}
      position='fixed'
      drawerWidth={drawerWidth}
      expanded={drawerExpanded}
    >
      <Toolbar>
        <DrawerToggleButton color='inherit' edge='start' onClick={toggleMenu}>
          {!isMobile && drawerExpanded ? <ArrowBackIcon /> : <MenuIcon />}
        </DrawerToggleButton>
        {ROUTES.includes(route) && (
          <Typography
            variant='h5'
            fontWeight='bold'
            sx={{ flexGrow: 1, ml: 1 }}
          >
            {startCase(route)}
          </Typography>
        )}
        {route === 'accounts' && <AccountsAppBar />}
        {route === 'transactions' && <TransactionsAppBar />}
        {[DASHBOARD].includes(route) && (
          <ReactiveButton
            label='Refresh'
            handleClick={handleRefresh}
            Icon={LoopIcon}
            color='primary'
            variant='outlined'
          />
        )}
      </Toolbar>
    </StyledAppBar>
  );
});

export default CustomAppBar;
