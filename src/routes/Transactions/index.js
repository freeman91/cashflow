import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid2';

import TransactionsCalendar from './Calendar';
import RecurringList from './RecurringList';
import TransactionsList from './List';

export default function Transactions() {
  const tab = useSelector((state) => state.appSettings.transactions.tab);
  const showInactive = useSelector(
    (state) => state.appSettings.transactions.showInactive
  );

  return (
    <Grid
      container
      spacing={1}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', px: 1 }}
    >
      {tab === 'calendar' && <TransactionsCalendar />}
      {tab === 'list' && <TransactionsList />}
      {tab === 'recurring' && <RecurringList showInactive={showInactive} />}
    </Grid>
  );
}
