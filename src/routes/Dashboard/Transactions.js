import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
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

  const [tabIdx, setTabIdx] = useState(0);
  const [recent, setRecent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const today = dayjs().hour(23).minute(59);
    const fourDaysAgo = dayjs().subtract(4, 'day').hour(0).minute(0);
    const recentTransactions = [
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

    setRecent(sortBy(recentTransactions, ['date', 'type']).reverse());
  }, [allExpenses, allRepayments, allIncomes, allPaychecks]);

  useEffect(() => {
    const threeDaysFromNow = dayjs().add(3, 'day').hour(23).minute(59);
    const upcomingExpenses = [...allExpenses, ...allRepayments].filter(
      (expense) => {
        const eDate = dayjs(expense.date);
        return eDate <= threeDaysFromNow && expense.pending;
      }
    );

    setUpcoming(sortBy(upcomingExpenses, 'date'));
  }, [allExpenses, allRepayments]);

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <Grid item xs={12} sx={{ mb: 9 }}>
      <StyledTabs value={tabIdx} onChange={handleChange} centered>
        <StyledTab label='recent' sx={{ width: '35%' }} />
        <StyledTab label='upcoming' sx={{ width: '35%' }} />
      </StyledTabs>
      <Box sx={{ width: '100%', px: 1, pb: 1, mt: '2px' }}>
        {tabIdx === 0 && (
          <Stack spacing={1} direction='column'>
            {map(recent, (transaction) => {
              return (
                <TransactionBox
                  key={findId(transaction)}
                  transaction={transaction}
                />
              );
            })}
          </Stack>
        )}
        {tabIdx === 1 && (
          <Stack spacing={1} direction='column'>
            {map(upcoming, (expense) => {
              return (
                <TransactionBox key={findId(expense)} transaction={expense} />
              );
            })}
          </Stack>
        )}
      </Box>
    </Grid>
  );
}
