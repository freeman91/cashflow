import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { refresh } from '../../store/user';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';

import HomeButtons from './HomeButtons';
import CurrentCashflow from './CurrentCashflow';
import CurrentNetworth from './CurrentNetworth';
import CustomAppBar from '../../components/CustomAppBar';
import TransactionsGridStack from '../../components/TransactionsGridStack';
import SearchButton from '../../components/CustomAppBar/SearchButton';
import SettingsButton from '../../components/CustomAppBar/SettingsButton';

const CustomToggleButton = (props) => {
  return <ToggleButton {...props} sx={{ py: 0.5, color: 'text.secondary' }} />;
};

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
    dispatch(refresh());
  };
  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

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
    let upcomingExpenses = [...allExpenses, ...allRepayments].filter(
      (expense) => expense.pending
    );
    upcomingExpenses = sortBy(upcomingExpenses, 'date');

    let pendingExpenses = remove(upcomingExpenses, (expense) => {
      return dayjs(expense.date).isSameOrBefore(today, 'day');
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
      <CustomAppBar left={<SearchButton />} right={<SettingsButton />} />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ pt: 1, mt: '42px' }}
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}
        <CurrentCashflow />
        <CurrentNetworth />
        <HomeButtons />
        <Grid item xs={12} display='flex' justifyContent='center'>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
            sx={{ mt: 2, px: 1 }}
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
