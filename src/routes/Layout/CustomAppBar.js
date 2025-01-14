import React, { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import MenuIcon from '@mui/icons-material/Menu';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@mui/material/styles/styled';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';

import { openItemView } from '../../store/itemView';
import { AppBarTab, AppBarTabs } from '../../components/AppBarTabs';
import CreateTransactionButton from '../Dashboard/Transactions/CreateTransactionButton';
import { setTab } from '../../store/appSettings';

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

const StyledBreadcrumbs = styled(Breadcrumbs, {
  shouldForwardProp: (prop) => !['isMobile'].includes(prop),
})(({ isMobile }) => ({
  '.MuiBreadcrumbs-li': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: isMobile ? 1 : 'unset',
    width: isMobile ? '100%' : 'unset',
  },
}));

function AccountAppBar(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const accounts = useSelector((state) => state.accounts.data);

  const [account, setAccount] = useState({});

  useEffect(() => {
    const _accountName = get(location.pathname.split('/'), 2);
    const _account = accounts.find(
      (a) => a.name === _accountName?.replace(/%20/g, ' ')
    );
    if (_account) setAccount(_account);
    else setAccount({});
    return () => {
      setAccount({});
    };
  }, [location, accounts]);

  const createAccount = () => {
    dispatch(openItemView({ itemType: 'account', mode: 'create' }));
  };

  return (
    <>
      <StyledBreadcrumbs
        isMobile={isMobile}
        sx={{
          ml: isMobile ? 0 : 1,
          width: '100%',
        }}
      >
        {!isMobile && (
          <Link
            underline='hover'
            color='text.primary'
            onClick={() => {
              dispatch(push('/accounts'));
            }}
          >
            <Typography variant='h5' fontWeight='bold' sx={{ mr: 1 }}>
              Accounts
            </Typography>
          </Link>
        )}
        {account.account_id && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {account.icon_url && (
              <Box
                sx={{
                  mx: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={account.icon_url}
                  alt={`${account.name} icon`}
                  height={30}
                  style={{ marginRight: 10, borderRadius: '10%' }}
                />
              </Box>
            )}
            <Typography
              variant='h5'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {account.name}
            </Typography>
          </Box>
        )}
      </StyledBreadcrumbs>
      {!account.account_id && (
        <Box sx={{ display: 'flex', gap: 1, height: 35 }}>
          {isMobile ? (
            <IconButton color='primary'>
              <LoopIcon />
            </IconButton>
          ) : (
            <Button variant='outlined' startIcon={<LoopIcon />}>
              Refresh
            </Button>
          )}
          {isMobile ? (
            <IconButton color='primary' onClick={createAccount}>
              <AddIcon />
            </IconButton>
          ) : (
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={createAccount}
            >
              Account
            </Button>
          )}
        </Box>
      )}
    </>
  );
}

function TransactionsAppBar() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const tab = useSelector((state) => state.appSettings.transactions.tab);
  const handleTabChange = (event, newValue) => {
    dispatch(setTab({ type: 'transactions', tab: newValue }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        // flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography variant='h5' fontWeight='bold' sx={{ ml: 1 }}>
        Transactions
      </Typography>
      {!isMobile && (
        <AppBarTabs value={tab} onChange={handleTabChange} sx={{ flexGrow: 1 }}>
          <AppBarTab label='Calendar' value='calendar' />
          <AppBarTab label='List' value='list' />
        </AppBarTabs>
      )}
      {isMobile && (
        <Select
          variant='standard'
          value={tab}
          onChange={(e) => handleTabChange(e, e.target.value)}
          sx={{ flexGrow: 1, mx: 4 }}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
            },
          }}
        >
          <MenuItem value='calendar'>Calendar</MenuItem>
          <MenuItem value='list'>List</MenuItem>
        </Select>
      )}
      <CreateTransactionButton />
    </Box>
  );
}

function RecurringAppBar() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const tab = useSelector((state) => state.appSettings.recurring.tab);
  const handleTabChange = (event, newValue) => {
    dispatch(setTab({ type: 'recurring', tab: newValue }));
  };

  const handleClick = () => {
    dispatch(
      openItemView({
        itemType: 'recurring',
        mode: 'create',
      })
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Typography variant='h5' fontWeight='bold' sx={{ ml: 1 }}>
        Recurring
      </Typography>
      {!isMobile && (
        <AppBarTabs value={tab} onChange={handleTabChange} sx={{ flexGrow: 1 }}>
          <AppBarTab label='Calendar' value='calendar' />
          <AppBarTab label='List' value='list' />
        </AppBarTabs>
      )}
      {isMobile && (
        <Select
          variant='standard'
          value={tab}
          onChange={(e) => handleTabChange(e, e.target.value)}
          sx={{ flexGrow: 1, mx: 4 }}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
            },
          }}
        >
          <MenuItem value='calendar'>Calendar</MenuItem>
          <MenuItem value='list'>List</MenuItem>
        </Select>
      )}
      {isMobile && (
        <IconButton color='primary' onClick={handleClick}>
          <AddIcon />
        </IconButton>
      )}
      {!isMobile && (
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          Add Recurring
        </Button>
      )}
    </Box>
  );
}

const CustomAppBar = forwardRef((props, ref) => {
  const { drawerExpanded, setDrawerExpanded, setMobileOpen } = props;
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [route, setRoute] = useState('dashboard');

  useEffect(() => {
    const _route = location.pathname.split('/')[1];
    setRoute(_route);
  }, [location]);

  const toggleMenu = () => {
    if (isMobile) setMobileOpen((currentOpen) => !currentOpen);
    else setDrawerExpanded((currentExpanded) => !currentExpanded);
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
        {['dashboard', 'reports', 'budgets', 'settings', 'profile'].includes(
          route
        ) && (
          <Typography
            variant='h5'
            fontWeight='bold'
            sx={{ flexGrow: 1, ml: 1 }}
          >
            {startCase(route)}
          </Typography>
        )}
        {route === 'accounts' && <AccountAppBar />}
        {route === 'transactions' && <TransactionsAppBar />}
        {route === 'recurring' && <RecurringAppBar />}
      </Toolbar>
    </StyledAppBar>
  );
});

export default CustomAppBar;
