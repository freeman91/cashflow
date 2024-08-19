import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { findId } from '../../helpers/transactions';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import TransactionBox from '../../components/TransactionBox';

export default function Transactions() {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [tabIdx, setTabIdx] = useState('recent');
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

  const handleChange = (e, newValue) => {
    setTabIdx(newValue);
  };

  const transactions = tabIdx === 'recent' ? recent : upcoming;
  return (
    <>
      <Grid item xs={12}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='recent' value='recent' />
          <StyledTab label='upcoming' value='upcoming' />
        </StyledTabs>
      </Grid>
      <Grid item xs={12} sx={{ mb: 10, mx: 1 }} pt={'2px !important'}>
        {transactions.length > 0 && (
          <Card raised>
            <Stack spacing={1} direction='column' pt={1} pb={1}>
              {map(transactions, (transaction, idx) => {
                const key = findId(transaction);
                return (
                  <React.Fragment key={key}>
                    <TransactionBox transaction={transaction} />
                    {idx < transactions.length - 1 && (
                      <Divider sx={{ mx: '8px !important' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        )}
      </Grid>
    </>
  );
}
