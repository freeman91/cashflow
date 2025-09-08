import React, { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoopIcon from '@mui/icons-material/Loop';
import MenuIcon from '@mui/icons-material/Menu';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@mui/material/styles/styled';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { getAudits } from '../../../store/audits';
import LogoImg from '../../../components/LogoImg';
import AccountsAppBar from './AccountsAppBar';
import DashboardAppBar from './DashboardAppBar';
import ReportsAppBar from './ReportsAppBar';
import TransactionsAppBar from './TransactionsAppBar';
import ReactiveButton from '../../../components/ReactiveButton';

const BUDGETS = 'budgets';
const SETTINGS = 'settings';
const PROFILE = 'profile';
const AUDIT_LOG = 'audit-log';

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
  const { drawerExpanded, setDrawerExpanded } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [route, setRoute] = useState('dashboard');

  useEffect(() => {
    const _route = location.pathname.split('/')[1];
    setRoute(_route);
  }, [location]);

  const toggleMenu = () => {
    setDrawerExpanded((currentExpanded) => !currentExpanded);
  };

  const handleRefreshAuditLog = () => {
    dispatch(getAudits());
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
          {isMobile ? (
            <LogoImg />
          ) : !drawerExpanded ? (
            <MenuIcon />
          ) : (
            <ArrowBackIcon />
          )}
        </DrawerToggleButton>
        {[BUDGETS, SETTINGS, PROFILE, AUDIT_LOG].includes(route) && (
          <Typography
            variant='h5'
            fontWeight='bold'
            sx={{
              flexGrow: isMobile ? 0 : 1,
              ml: 1,
              ...(isMobile && {
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }),
            }}
          >
            {startCase(route)}
          </Typography>
        )}
        {route === 'accounts' && <AccountsAppBar />}
        {route === 'transactions' && <TransactionsAppBar />}
        {route === 'reports' && <ReportsAppBar />}
        {route === 'dashboard' && <DashboardAppBar />}
        {isMobile &&
          [BUDGETS, SETTINGS, PROFILE, AUDIT_LOG].includes(route) && (
            <Box sx={{ flexGrow: 1 }} />
          )}
        {route === 'audit-log' && (
          <ReactiveButton
            label='Refresh'
            handleClick={handleRefreshAuditLog}
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
