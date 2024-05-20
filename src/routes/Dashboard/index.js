import React, { useState } from 'react';
import dayjs from 'dayjs';

import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import NewTransactionButton from '../../components/NewTransactionButton';
import Cashflow from './Cashflow';
import Spending from './Spending';
import Expenses from './Expenses';
import Week from '../../components/Calendar/Week';

export default function Dashboard() {
  const theme = useTheme();
  const [month, setMonth] = useState(dayjs().date(15).hour(12).minute(0));

  const [selectedExpenses, setSelectedExpenses] = useState([]);

  return (
    <>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Grid item xs={12} sx={{ pt: '0 !important' }}>
          <Week />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Cashflow month={month} setMonth={setMonth} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Spending month={month} setSelectedExpenses={setSelectedExpenses} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Expenses expenses={selectedExpenses} />
        </Grid>
      </Grid>
      <NewTransactionButton transactionTypes={['expense', 'income']} />
    </>
  );
}
