import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';

import Cashflow from './Cashflow';
import Networth from './Networth';
import TransactionsGridStack from '../../../components/TransactionsGridStack';
import { StyledSubtab, StyledSubtabs } from '../../../components/StyledSubtabs';
import FloatingActionButton from '../../../components/FloatingActionButton';

const RECENT = 'recent';
const UPCOMING = 'upcoming';
const TABS = [RECENT, UPCOMING];

export default function Overview(props) {
  const { month } = props;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [tab, setTab] = useState(RECENT);
  const [recent, setRecent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const today = dayjs().hour(23).minute(59);
    const fourDaysAgo = dayjs().subtract(4, 'day').hour(0).minute(0);
    let recentTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
    ].filter((transaction) => {
      if (!transaction.date) return false;
      const eDate = dayjs(transaction.date);
      if (
        (transaction._type === 'expense' ||
          transaction._type === 'repayment') &&
        transaction.pending
      ) {
        return false;
      }
      return eDate >= fourDaysAgo && eDate <= today;
    });

    recentTransactions = sortBy(recentTransactions, ['date', 'type'])
      .reverse()
      .slice(0, 7);
    setRecent(recentTransactions);
  }, [allExpenses, allRepayments, allIncomes, allPaychecks]);

  useEffect(() => {
    let pendingExpenses = [...allExpenses, ...allRepayments].filter(
      (expense) => expense.pending
    );
    pendingExpenses = sortBy(pendingExpenses, 'date').slice(0, 7);
    setUpcoming(pendingExpenses);
  }, [allExpenses, allRepayments]);

  const changeTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Cashflow year={month.year()} month={month.month()} />
      <Networth />
      <Grid
        item
        xs={12}
        mx={1}
        mt={isMobile ? 0 : 1}
        display='flex'
        justifyContent='center'
      >
        <StyledSubtabs
          variant='fullWidth'
          sx={{ pb: 1, maxWidth: 400, width: '100%' }}
          value={tab}
          onChange={changeTab}
        >
          {TABS.map((_tab) => (
            <StyledSubtab key={_tab} label={_tab} value={_tab} />
          ))}
        </StyledSubtabs>
      </Grid>
      {tab === RECENT && <TransactionsGridStack transactions={recent} />}
      {tab === UPCOMING && <TransactionsGridStack transactions={upcoming} />}
      <FloatingActionButton createTypes={['expense', 'income', 'paycheck']} />
    </>
  );
}
