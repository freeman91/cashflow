import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';

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

  const handleTabChange = (event, newValue) => {
    dispatch(setTab({ type: 'transactions', tab: newValue }));
  };

  const handleRefresh = () => {
    dispatch(refreshTransactions());
  };

  const handleCreateRecurringClick = () => {
    dispatch(
      openItemView({
        itemType: 'recurring',
        mode: 'create',
      })
    );
  };

  return (
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
      {!isMobile && (
        <AppBarTabs
          value={tab}
          onChange={handleTabChange}
          sx={{ flexGrow: 1, ml: 4 }}
        >
          <AppBarTab label='Calendar' value='calendar' />
          <AppBarTab label='List' value='list' />
          <AppBarTab label='Recurring' value='recurring' />
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
          <MenuItem value='recurring'>Recurring</MenuItem>
        </Select>
      )}
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
  );
}
