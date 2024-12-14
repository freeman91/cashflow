import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { refreshAll } from '../../store/user';

import HomeButtons from './HomeButtons';
import CurrentCashflow from './CurrentCashflow';
import CurrentNetworth from './CurrentNetworth';
import CustomAppBar from '../../components/CustomAppBar';
import CustomToggleButton from '../../components/CustomToggleButton';
import PullToRefresh from '../../components/PullToRefresh';
import TransactionsGridStack from '../../components/TransactionsGridStack';

export default function Home() {
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [tab, setTab] = useState('pending');
  const [recent, setRecent] = useState([]);
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

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

    recentTransactions = sortBy(recentTransactions, ['date', 'type'])
      .reverse()
      .slice(0, 7);
    setRecent(recentTransactions);
  }, [allExpenses, allRepayments, allIncomes, allPaychecks]);

  useEffect(() => {
    const today = dayjs();
    const _allExpenses = [...allExpenses, ...allRepayments];
    let upcomingExpenses = _allExpenses.filter((expense) =>
      dayjs(expense.date).isAfter(today, 'day')
    );
    upcomingExpenses = sortBy(upcomingExpenses, 'date');

    let pendingExpenses = _allExpenses.filter((expense) => {
      return (
        dayjs(expense.date).isSameOrBefore(today, 'day') && expense.pending
      );
    });

    setPending(pendingExpenses);
    setUpcoming(upcomingExpenses.slice(0, 7));
  }, [allExpenses, allRepayments]);

  useEffect(() => {
    if (tab === 'pending') {
      setTransactions(pending);
    } else if (tab === 'upcoming') {
      setTransactions(upcoming);
    } else {
      setTransactions(recent);
    }
  }, [tab, recent, pending, upcoming]);

  useEffect(() => {
    if (tab === 'pending' && pending.length === 0) {
      setTab('recent');
    }
  }, [tab, pending]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar left={<Box width={35} />} />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />
        <Grid item xs={12} mt={0} />
        <CurrentCashflow />
        <Grid item xs={6}>
          <CurrentNetworth />
        </Grid>

        <HomeButtons />
        <Grid item xs={12} display='flex' justifyContent='center' mx={1} mt={1}>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
          >
            {recent.length > 0 && (
              <CustomToggleButton value='recent'>recent</CustomToggleButton>
            )}
            {pending.length > 0 && (
              <CustomToggleButton value='pending'>pending</CustomToggleButton>
            )}
            {upcoming.length > 0 && (
              <CustomToggleButton value='upcoming'>upcoming</CustomToggleButton>
            )}
          </ToggleButtonGroup>
        </Grid>
        <TransactionsGridStack transactions={transactions} />
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
