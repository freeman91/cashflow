import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';

import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import LayersIcon from '@mui/icons-material/Layers';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import TableRowsIcon from '@mui/icons-material/TableRows';

import { styled } from '@mui/material/styles';
import { useColorScheme } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoImg from '../../components/LogoImg';

const MobileDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['drawerWidth'].includes(prop),
})(({ drawerWidth }) => {
  const style = {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  };
  return {
    ...style,
    '& .MuiDrawer-paper': { ...style },
  };
});

const drawerMixin = (theme, expanded) => ({
  width: expanded ? theme.drawerWidth : 0,
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: expanded
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
  }),
});

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['expanded'].includes(prop),
})(({ theme, expanded }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  ...drawerMixin(theme, expanded),
  '& .MuiDrawer-paper': {
    ...drawerMixin(theme, expanded),
    scrollbarWidth: 'thin',
    borderRight: 'none',
  },
}));

const PageButton = (props) => {
  const { pageName, currentPage, icon } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(push(`/${pageName.toLowerCase()}`, {}));
  };

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        m: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 1,
      }}
      selected={currentPage === pageName.toLowerCase()}
    >
      <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={pageName}
        slotProps={{
          primary: {
            variant: 'body2',
          },
        }}
      />
    </ListItemButton>
  );
};

const DrawerContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { mode, setMode } = useColorScheme();
  const [page, setPage] = useState('');

  useEffect(() => {
    const _page = location.pathname.split('/')[1];
    setPage(_page);
  }, [location]);

  return (
    <List disablePadding>
      <ListItem
        sx={{ display: 'flex', justifyContent: 'space-between', pr: 0 }}
      >
        <ListItemIcon sx={{ minWidth: 'fit-content' }}>
          <LogoImg />
        </ListItemIcon>
        <Box>
          <IconButton
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          >
            {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <IconButton onClick={() => dispatch(push('/settings'))}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </ListItem>
      <PageButton pageName='Dashboard' currentPage={page} icon={<HomeIcon />} />
      <PageButton
        pageName='Accounts'
        currentPage={page}
        icon={<LayersIcon />}
      />
      <PageButton
        pageName='Transactions'
        currentPage={page}
        icon={<TableRowsIcon />}
      />
      <PageButton
        pageName='Reports'
        currentPage={page}
        icon={<AssessmentIcon />}
      />
      <PageButton
        pageName='Budgets'
        currentPage={page}
        icon={<AssignmentIcon />}
      />
    </List>
  );
};

export default function DesktopDrawer(props) {
  const { drawerExpanded, mobileOpen, setMobileOpen } = props;
  const theme = useTheme();

  return (
    <nav aria-label='drawer'>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <MobileDrawer
          drawerWidth={theme.drawerWidth}
          variant='temporary'
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={() => setMobileOpen((currentOpen) => !currentOpen)}
          ModalProps={{ keepMounted: true }}
        >
          <DrawerContent />
        </MobileDrawer>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <StyledDrawer variant='permanent' expanded={drawerExpanded}>
          <DrawerContent />
        </StyledDrawer>
      </Box>
    </nav>
  );
}
