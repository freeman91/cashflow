import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { useTheme } from '@mui/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaidIcon from '@mui/icons-material/Paid';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import MovingIcon from '@mui/icons-material/Moving';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function DrawerListItem({ page, icon, handlePageClick }) {
  return (
    <ListItemButton key={page} onClick={() => handlePageClick(`/${page}`)}>
      <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={page} />
    </ListItemButton>
  );
}

function AppDrawer(props) {
  const { window, mobileOpen, setMobileOpen } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const [openSearch, setOpenSearch] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePageClick = (page) => {
    dispatch(push(`/app${page}`));
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <List disablePadding>
        <ListItem>
          <ListItemText
            primary='cashflow'
            onClick={() => handlePageClick('')}
            primaryTypographyProps={{
              variant: 'h6',
              sx: { fontWeight: 800, cursor: 'pointer' },
              align: 'center',
            }}
          />
        </ListItem>

        <Divider />

        <ListItem
          disableGutters
          disablePadding
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <ListItemButton
            disableGutters
            onClick={() => handlePageClick('')}
            sx={{ justifyContent: 'center' }}
          >
            <ListItemIcon
              sx={{ '&.MuiListItemIcon-root': { minWidth: 'auto' } }}
            >
              <DashboardIcon />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton
            disableGutters
            onClick={() => handlePageClick('/calendar')}
            sx={{ justifyContent: 'center' }}
          >
            <ListItemIcon
              sx={{ '&.MuiListItemIcon-root': { minWidth: 'auto' } }}
            >
              <CalendarMonthIcon />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton
            disableGutters
            onClick={() => handlePageClick('/year')}
            sx={{ justifyContent: 'center' }}
          >
            <ListItemIcon
              sx={{ '&.MuiListItemIcon-root': { minWidth: 'auto' } }}
            >
              <CalendarViewMonthIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>

        <ListItemButton onClick={() => handlePageClick('/networth')}>
          <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
            <MovingIcon />
          </ListItemIcon>
          <ListItemText primary='net worth' />
        </ListItemButton>

        <ListItemButton onClick={() => setOpenSearch(!openSearch)}>
          <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary='search' />
          {openSearch ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSearch} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => handlePageClick('/search/expenses')}
            >
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
                <ReceiptLongIcon />
              </ListItemIcon>
              <ListItemText primary='expenses' />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => handlePageClick('/search/incomes')}
            >
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
                <AccountBalanceWalletIcon />
              </ListItemIcon>
              <ListItemText primary='incomes' />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => handlePageClick('/search/bills')}
            >
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary='bills' />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => handlePageClick('/search/accounts')}
            >
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary='accounts' />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => handlePageClick('/search/assets')}
            >
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
                <PaidIcon />
              </ListItemIcon>
              <ListItemText primary='assets' />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => handlePageClick('/search/debts')}
            >
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 40 } }}>
                <CreditCardIcon />
              </ListItemIcon>
              <ListItemText primary='debts' />
            </ListItemButton>
          </List>
        </Collapse>

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
    <Box
      component='nav'
      sx={{
        width: { sm: theme.drawerWidth },
        flexShrink: { sm: 0 },
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
  );
}

export default AppDrawer;
