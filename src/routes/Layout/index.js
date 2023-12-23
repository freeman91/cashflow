import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { useTheme } from '@mui/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import MovingIcon from '@mui/icons-material/Moving';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import MainContent from './MainContent';

import AccountDialog from '../../components/Dialog/AccountDialog';
import AssetDialog from '../../components/Dialog/AssetDialog';
import BillDialog from '../../components/Dialog/BillDialog ';
import BorrowDialog from '../../components/Dialog/BorrowDialog';
import DebtDialog from '../../components/Dialog/DebtDialog';
import ExpenseDialog from '../../components/Dialog/ExpenseDialog';
import IncomeDialog from '../../components/Dialog/IncomeDialog';
import NetworthDialog from '../../components/Dialog/NetworthDialog';
import PaycheckDialog from '../../components/Dialog/PaycheckDialog';
import PurchaseDialog from '../../components/Dialog/PurchaseDialog';
import RepaymentDialog from '../../components/Dialog/RepaymentDialog';
import SaleDialog from '../../components/Dialog/SaleDialog';

import { getUser } from '../../store/user';

const USER_ID = process.env.REACT_APP_USER_ID;

function DrawerListItem({ page, icon, handlePageClick }) {
  return (
    <ListItem key={page} disablePadding>
      <ListItemButton onClick={() => handlePageClick(`/${page}`)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={page} />
      </ListItemButton>
    </ListItem>
  );
}

function Layout(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pageName, setPageName] = React.useState('dashboard');

  /* onMount */
  useEffect(() => {
    dispatch(getUser(USER_ID));
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    let _pageName = 'dashboard';
    if (location.pathname.startsWith('/app/accounts')) _pageName = 'accounts';
    if (location.pathname.startsWith('/app/expenses')) _pageName = 'expenses';
    if (location.pathname.startsWith('/app/income')) _pageName = 'income';
    if (location.pathname.startsWith('/app/networth')) _pageName = 'networth';
    if (location.pathname.startsWith('/app/settings')) _pageName = 'settings';
    setPageName(_pageName);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePageClick = (page) => {
    dispatch(push(`/app${page}`));
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <List>
        <ListItem key='app-name' onClick={() => handlePageClick('')}>
          <ListItemText
            primary='cashflow'
            primaryTypographyProps={{ variant: 'h6', sx: { fontWeight: 800 } }}
          />
        </ListItem>
        <Divider />
        <DrawerListItem
          page='accounts'
          icon={<AccountBalanceIcon />}
          handlePageClick={handlePageClick}
        />
        <DrawerListItem
          page='expenses'
          icon={<ReceiptIcon />}
          handlePageClick={handlePageClick}
        />
        <DrawerListItem
          page='income'
          icon={<PaidIcon />}
          handlePageClick={handlePageClick}
        />
        <DrawerListItem
          page='networth'
          icon={<MovingIcon />}
          handlePageClick={handlePageClick}
        />
        <DrawerListItem
          page='settings'
          icon={<SettingsIcon />}
          handlePageClick={handlePageClick}
        />
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
          <Typography align='right' sx={{ flexGrow: 1 }}>
            addison@example.com
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{
          width: { sm: theme.drawerWidth },
          flexSh0rink: { sm: 0 },
        }}
      >
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: theme.drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: theme.drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <MainContent drawerWidth={theme.drawerWidth} />
      <AccountDialog />
      <AssetDialog />
      <BillDialog />
      <BorrowDialog />
      <DebtDialog />
      <ExpenseDialog />
      <IncomeDialog />
      <NetworthDialog />
      <PaycheckDialog />
      <PurchaseDialog />
      <RepaymentDialog />
      <SaleDialog />
    </Box>
  );
}

export default Layout;
