import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import TransactionsTable from './Table';
import CreateTransactionButton from './CreateTransactionButton';

export default function Transactions() {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allBorrows = useSelector((state) => state.borrows.data);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const today = dayjs();
    const sevenDaysAgo = dayjs().subtract(7, 'day');
    let recentTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
      ...allPurchases,
      ...allSales,
      ...allBorrows,
    ].filter((transaction) => {
      if (!transaction.date) return false;
      const tDate = dayjs(transaction.date);
      if (tDate.isAfter(today, 'day') || tDate.isBefore(sevenDaysAgo, 'day'))
        return false;
      return true;
    });
    recentTransactions = sortBy(recentTransactions, ['date']).reverse();
    setTransactions(recentTransactions);
  }, [
    allExpenses,
    allRepayments,
    allIncomes,
    allPaychecks,
    allPurchases,
    allSales,
    allBorrows,
  ]);

  return (
    <Grid item xs={12} mt={2}>
      <Box
        sx={{
          backgroundColor: 'surface.250',
          borderRadius: 1,

          py: 1,
          boxShadow: (theme) => theme.shadows[4],
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mr: 2,
            py: 1,
          }}
        >
          <Typography
            variant='body1'
            fontWeight='bold'
            color='text.secondary'
            sx={{ px: 2 }}
          >
            TRANSACTIONS
          </Typography>
          <CreateTransactionButton />
        </Box>

        <Typography variant='h5' fontWeight='bold' sx={{ px: 2, pb: 2 }}>
          Recent
        </Typography>
        <TransactionsTable transactions={transactions} />
      </Box>
    </Grid>
  );
}
