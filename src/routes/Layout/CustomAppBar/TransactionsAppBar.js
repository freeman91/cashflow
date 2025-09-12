import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LoopIcon from '@mui/icons-material/Loop';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import RepeatIcon from '@mui/icons-material/Repeat';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ViewListIcon from '@mui/icons-material/ViewList';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { setTab, setShowInactive } from '../../../store/appSettings';
import { openItemView } from '../../../store/itemView';
import { refreshTransactions } from '../../../store/user';
import { AppBarTab, AppBarTabs } from '../../../components/AppBarTabs';
import ReactiveButton from '../../../components/ReactiveButton';

const Puller = styled('div')(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.surface[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
  zIndex: 1,
}));

export default function TransactionsAppBar() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const tab = useSelector((state) => state.appSettings.transactions.tab);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const showInactive = useSelector(
    (state) => state.appSettings.transactions.showInactive
  );

  const handleDrawerToggle = () => {
    setDrawerOpen((prevOpen) => !prevOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    dispatch(setTab({ type: 'transactions', tab: newValue }));
    handleDrawerClose();
  };

  const handleRefresh = () => {
    dispatch(refreshTransactions());
    handleDrawerClose();
  };

  const handleCreateRecurring = () => {
    dispatch(
      openItemView({
        itemType: 'recurring',
        mode: 'create',
        attrs: {},
      })
    );
    handleDrawerClose();
  };

  const handleToggleInactive = () => {
    dispatch(setShowInactive(!showInactive));
    handleDrawerClose();
  };

  return (
    <>
      {isMobile ? (
        // Mobile Layout: Centered title + Right menu button
        <>
          <Typography
            variant='h5'
            fontWeight='bold'
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60%',
            }}
          >
            Transactions
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton onClick={handleDrawerToggle}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <SwipeableDrawer
            anchor='bottom'
            open={drawerOpen}
            onOpen={() => {}} // Prevent opening on swipe up
            onClose={handleDrawerClose}
            sx={{
              '& .MuiDrawer-paper': {
                height: '40%',
                overflow: 'visible',
                backgroundColor: (theme) => theme.palette.surface[250],
                backgroundImage: 'unset',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              },
            }}
          >
            <Puller />
            <List disablePadding sx={{ px: 2, pt: 4, bgcolor: 'unset' }}>
              <ListItemButton
                onClick={() => handleTabChange(null, 'calendar')}
                sx={{
                  my: 1,
                  bgcolor: 'surface.200',
                  borderRadius: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'surface.300',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    position: 'absolute',
                    left: 16,
                    minWidth: 'auto',
                    zIndex: 1,
                  }}
                >
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary='Calendar'
                  sx={{ textAlign: 'center' }}
                  slotProps={{
                    primary: {
                      sx: { fontWeight: 500 },
                    },
                  }}
                />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleTabChange(null, 'list')}
                sx={{
                  my: 1,
                  bgcolor: 'surface.200',
                  borderRadius: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'surface.300',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    position: 'absolute',
                    left: 16,
                    minWidth: 'auto',
                    zIndex: 1,
                  }}
                >
                  <ViewListIcon />
                </ListItemIcon>
                <ListItemText
                  primary='List'
                  sx={{ textAlign: 'center' }}
                  slotProps={{
                    primary: {
                      sx: { fontWeight: 500 },
                    },
                  }}
                />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleTabChange(null, 'recurring')}
                sx={{
                  my: 1,
                  bgcolor: 'surface.200',
                  borderRadius: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'surface.300',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    position: 'absolute',
                    left: 16,
                    minWidth: 'auto',
                    zIndex: 1,
                  }}
                >
                  <RepeatIcon />
                </ListItemIcon>
                <ListItemText
                  primary='Recurring'
                  sx={{ textAlign: 'center' }}
                  slotProps={{
                    primary: {
                      sx: { fontWeight: 500 },
                    },
                  }}
                />
              </ListItemButton>
              <ListItemButton
                onClick={handleRefresh}
                sx={{
                  my: 1,
                  bgcolor: 'surface.200',
                  borderRadius: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'surface.300',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    position: 'absolute',
                    left: 16,
                    minWidth: 'auto',
                    zIndex: 1,
                  }}
                >
                  <RefreshIcon />
                </ListItemIcon>
                <ListItemText
                  primary='Refresh'
                  sx={{ textAlign: 'center' }}
                  slotProps={{
                    primary: {
                      sx: { fontWeight: 500 },
                    },
                  }}
                />
              </ListItemButton>
              {tab === 'recurring' && (
                <ListItemButton
                  onClick={handleToggleInactive}
                  sx={{
                    my: 1,
                    bgcolor: 'surface.200',
                    borderRadius: 1,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      bgcolor: 'surface.300',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      position: 'absolute',
                      left: 16,
                      minWidth: 'auto',
                      zIndex: 1,
                    }}
                  >
                    {showInactive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={showInactive ? 'Hide Inactive' : 'Show Inactive'}
                    sx={{ textAlign: 'center' }}
                    slotProps={{
                      primary: {
                        sx: { fontWeight: 500 },
                      },
                    }}
                  />
                </ListItemButton>
              )}
            </List>
          </SwipeableDrawer>
        </>
      ) : (
        // Desktop Layout: Original layout
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant='h5' fontWeight='bold' sx={{ ml: 1 }}>
            Transactions
          </Typography>
          <AppBarTabs
            value={tab}
            onChange={handleTabChange}
            sx={{ flexGrow: 1, ml: 4 }}
          >
            <AppBarTab label='Calendar' value='calendar' />
            <AppBarTab label='List' value='list' />
            <AppBarTab label='Recurring' value='recurring' />
          </AppBarTabs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {tab === 'recurring' && (
              <ReactiveButton
                label='Recurring'
                handleClick={handleCreateRecurring}
                Icon={AddIcon}
                color='primary'
              />
            )}
            {tab === 'recurring' && (
              <ReactiveButton
                label={showInactive ? 'Hide Inactive' : 'Show Inactive'}
                handleClick={handleToggleInactive}
                Icon={showInactive ? ToggleOnIcon : ToggleOffIcon}
                color='primary'
                variant='outlined'
              />
            )}
            <ReactiveButton
              label='Refresh'
              handleClick={handleRefresh}
              Icon={LoopIcon}
              color='primary'
              variant='outlined'
            />
          </Box>
        </Box>
      )}
    </>
  );
}
