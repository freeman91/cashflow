import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';

import styled from '@mui/material/styles/styled';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import TableRowsIcon from '@mui/icons-material/TableRowsOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVertOutlined';
import GradingIcon from '@mui/icons-material/GradingOutlined';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const Puller = styled('div')(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.surface[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
}));

const CustomListItemButton = (props) => {
  const { Icon, text, onClick } = props;
  return (
    <ListItemButton
      onClick={onClick}
      sx={{ my: 2, bgcolor: 'surface.200', borderRadius: 1 }}
    >
      <ListItemIcon sx={{ minWidth: 'unset' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{ ml: 3 }}
        slotProps={{
          primary: { align: 'left' },
        }}
      />
      <ListItemIcon sx={{ minWidth: 'unset' }}>
        <ChevronRightIcon />
      </ListItemIcon>
    </ListItemButton>
  );
};

export default function MobileBottomNavigation() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [pageName, setPageName] = useState('dashboard');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let path = location.pathname.split('/');
    let _pageName = path[1];
    setPageName(_pageName);
  }, [location]);

  const handleNavigate = (path) => {
    dispatch(push(`/${path}`));
    setOpen(false);
  };

  const onChange = (e, value) => {
    if (value === null) return;
    if (value === 'more') {
      setOpen(true);
    } else {
      handleNavigate(value);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        pt: 0.5,
        pb: 2,
        background: (theme) => theme.palette.surface[150],
        zIndex: 1,
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.surface[200],
        maxWidth: 500,
      }}
    >
      <BottomNavigation
        value={pageName}
        sx={{ backgroundColor: 'unset' }}
        onChange={onChange}
        showLabels
      >
        <BottomNavigationAction
          label='Dashboard'
          value='dashboard'
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label='Accounts'
          value='accounts'
          icon={<AccountBalanceIcon />}
        />
        <BottomNavigationAction
          label='Transactions'
          value='transactions'
          icon={<TableRowsIcon />}
        />
        <BottomNavigationAction
          label='Reports'
          value='reports'
          icon={<AssessmentIcon />}
        />
        <BottomNavigationAction
          label='More'
          value='more'
          icon={<MoreVertIcon />}
        />
      </BottomNavigation>
      <SwipeableDrawer
        anchor='bottom'
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            height: '45%',
            overflow: 'visible',
            backgroundColor: (theme) => theme.palette.surface[250],
            backgroundImage: 'unset',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },
        }}
      >
        <Puller />
        <List disablePadding sx={{ px: 1, pt: 1, bgcolor: 'unset' }}>
          <CustomListItemButton
            Icon={AssignmentIcon}
            text='Budgets'
            onClick={() => handleNavigate('budgets')}
          />
          <CustomListItemButton
            Icon={GradingIcon}
            text='Audit Log'
            onClick={() => handleNavigate('audit-log')}
          />
          <CustomListItemButton
            Icon={SettingsIcon}
            text='Settings'
            onClick={() => handleNavigate('settings')}
          />
        </List>
      </SwipeableDrawer>
    </Box>
  );
}
