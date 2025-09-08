import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { setTab } from '../../../store/appSettings';
import { openItemView } from '../../../store/itemView';
import { refreshTransactions } from '../../../store/user';
import { AppBarTab, AppBarTabs } from '../../../components/AppBarTabs';
import ReactiveButton from '../../../components/ReactiveButton';
import CreateTransactionButton from '../../Dashboard/Transactions/CreateTransactionButton';

export default function TransactionsAppBar() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const tab = useSelector((state) => state.appSettings.transactions.tab);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    dispatch(setTab({ type: 'transactions', tab: newValue }));
    handleMenuClose();
  };

  const handleRefresh = () => {
    dispatch(refreshTransactions());
    handleMenuClose();
  };

  const handleCreateRecurringClick = () => {
    dispatch(
      openItemView({
        itemType: 'recurring',
        mode: 'create',
      })
    );
    handleMenuClose();
  };

  const handleCreateTransactionClick = (type) => {
    dispatch(
      openItemView({
        itemType: type,
        mode: 'create',
        attrs: {},
      })
    );
    handleMenuClose();
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
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleTabChange(null, 'calendar')}>
              <Typography variant='body2'>Calendar</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleTabChange(null, 'list')}>
              <Typography variant='body2'>List</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleTabChange(null, 'recurring')}>
              <Typography variant='body2'>Recurring</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleRefresh}>
              <LoopIcon sx={{ mr: 1 }} />
              <Typography variant='body2'>Refresh</Typography>
            </MenuItem>
            {tab !== 'recurring' && (
              <>
                <MenuItem
                  onClick={() => handleCreateTransactionClick('expense')}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  <Typography variant='body2'>Expense</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleCreateTransactionClick('income')}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  <Typography variant='body2'>Income</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleCreateTransactionClick('paycheck')}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  <Typography variant='body2'>Paycheck</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleCreateTransactionClick('repayment')}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  <Typography variant='body2'>Repayment</Typography>
                </MenuItem>
              </>
            )}
            {tab === 'recurring' && (
              <MenuItem onClick={handleCreateRecurringClick}>
                <AddIcon sx={{ mr: 1 }} />
                <Typography variant='body2'>Create Recurring</Typography>
              </MenuItem>
            )}
          </Menu>
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
            <ReactiveButton
              label='Refresh'
              handleClick={handleRefresh}
              Icon={LoopIcon}
              color='primary'
              variant='outlined'
            />
            {tab !== 'recurring' && <CreateTransactionButton />}
            {tab === 'recurring' && (
              <ReactiveButton
                label='Recurring'
                handleClick={handleCreateRecurringClick}
                Icon={AddIcon}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
