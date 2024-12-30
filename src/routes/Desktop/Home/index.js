import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PlaceholderBox from '../../../components/PlaceholderBox';
import TransactionsTable from './Transactions/Table';

export default function DesktopHome() {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [recent, setRecent] = useState([]);
  const [pendingAndUpcoming, setPendingAndUpcoming] = useState([]);

  useEffect(() => {
    const today = dayjs();
    const fourDaysAgo = dayjs().subtract(4, 'day');
    let recentTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
    ].filter((transaction) => {
      if (!transaction.date) return false;
      const tDate = dayjs(transaction.date);
      if (
        (transaction._type === 'expense' ||
          transaction._type === 'repayment') &&
        transaction.pending
      ) {
        return false;
      }
      return (
        tDate.isSameOrAfter(fourDaysAgo, 'day') &&
        tDate.isSameOrBefore(today, 'day')
      );
    });

    recentTransactions = sortBy(recentTransactions, ['date', 'type']).reverse();
    setRecent(recentTransactions);
  }, [allExpenses, allRepayments, allIncomes, allPaychecks]);

  useEffect(() => {
    const today = dayjs();
    const fourDaysAhead = dayjs().add(4, 'day');
    const _allExpenses = [...allExpenses, ...allRepayments];
    let upcomingExpenses = _allExpenses.filter(
      (expense) =>
        dayjs(expense.date).isAfter(today, 'day') &&
        dayjs(expense.date).isBefore(fourDaysAhead, 'day')
    );
    upcomingExpenses = sortBy(upcomingExpenses, 'date');

    let pendingExpenses = _allExpenses.filter((expense) => {
      return (
        dayjs(expense.date).isSameOrBefore(today, 'day') && expense.pending
      );
    });

    upcomingExpenses = upcomingExpenses.slice(0, 4);
    const _pendingAndUpcoming = [...pendingExpenses, ...upcomingExpenses];
    _pendingAndUpcoming
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
      .reverse();

    setPendingAndUpcoming(_pendingAndUpcoming);
  }, [allExpenses, allRepayments]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ maxWidth: 1000, mx: 'auto', width: '100%', mt: 1 }}
      >
        <Grid item xs={6} display='flex' justifyContent='center'>
          <PlaceholderBox>cashflow, expenses, incomes</PlaceholderBox>
        </Grid>
        <Grid
          item
          xs={6}
          display='flex'
          justifyContent='center'
          sx={{ height: 250 }}
        >
          <PlaceholderBox>accounts</PlaceholderBox>
        </Grid>
        <TransactionsTable
          transactions={pendingAndUpcoming}
          label='pending and upcoming'
        />
        <TransactionsTable transactions={recent} label='transaction history' />
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
