import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { findId } from '../../helpers/transactions';
import TransactionBox2 from '../../components/TransactionBox2';
import BoxFlexCenter from '../../components/BoxFlexCenter';

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
      .slice(0, 10);
    setRecent(recentTransactions);
  }, [allExpenses, allRepayments, allIncomes, allPaychecks]);

  useEffect(() => {
    let pendingExpenses = [...allExpenses, ...allRepayments].filter(
      (expense) => expense.pending
    );
    pendingExpenses = sortBy(pendingExpenses, 'date').slice(0, 5);
    setUpcoming(pendingExpenses);
  }, [allExpenses, allRepayments]);

  const handleChange = () => {
    setTabIdx(tabIdx === 1 ? 0 : 1);
  };

  const label = (() => {
    if (tabIdx === 0) return 'recent';
    if (tabIdx === 1) return 'upcoming';
    return null;
  })();
  return (
    <Grid
      item
      xs={12}
      sx={{ mb: 9 }}
      // mx={1}
      pt={'0 !important'}
    >
      <BoxFlexCenter
        sx={{ flexDirection: 'row', justifyContent: 'space-between', mx: 2 }}
      >
        {label && (
          <Typography variant='h5' fontWeight='bold' color='grey.0'>
            {label + ' transactions'}
          </Typography>
        )}
        <IconButton onClick={handleChange}>
          <SwapHorizIcon fontSize='large' />
        </IconButton>
      </BoxFlexCenter>
      <Box sx={{ width: '100%' }}>
        {tabIdx === 0 && (
          <Card raised sx={{ borderRadius: 0 }}>
            <Stack spacing={1} direction='column' pt={1} pb={1}>
              {map(recent, (transaction, idx) => {
                const key = findId(transaction);
                return (
                  <React.Fragment key={key}>
                    <TransactionBox2
                      key={findId(transaction)}
                      transaction={transaction}
                    />
                    {idx < recent.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        )}
        {tabIdx === 1 && (
          <Card raised sx={{ borderRadius: 0 }}>
            <Stack spacing={1} direction='column' pt={1} pb={1}>
              {map(upcoming, (expense, idx) => {
                const key = findId(expense);
                return (
                  <React.Fragment key={key}>
                    <TransactionBox2
                      key={findId(expense)}
                      transaction={expense}
                    />
                    {idx < upcoming.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        )}
      </Box>
    </Grid>
  );
}
