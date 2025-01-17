import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid2';

import TransactionsTable from '../../components/TransactionsTable';
import TransactionsCalendar from './Calendar';
import RecurringList from './RecurringList';

export default function Transactions() {
  const tab = useSelector((state) => state.appSettings.transactions.tab);
  return (
    <Grid
      container
      spacing={1}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', px: 1 }}
    >
      {tab === 'calendar' && <TransactionsCalendar />}
      {tab === 'list' && <TransactionsTable />}
      {tab === 'recurring' && <RecurringList />}
    </Grid>
  );
}
