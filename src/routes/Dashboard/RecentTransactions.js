import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import TransactionsTable from './TransactionsTable';

export default function RecentTransactions() {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const today = dayjs().hour(23).minute(59);
    const sevenDaysAgo = dayjs().subtract(7, 'day').hour(0).minute(0);
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
      return eDate >= sevenDaysAgo && eDate <= today;
    });

    setTransactions(sortBy(recentTransactions, 'date').reverse());
  }, [allExpenses, allRepayments, allIncomes, allPaychecks]);

  return (
    <>
      <Typography variant='body1'>recent transactions</Typography>
      <Card raised>
        <CardContent sx={{ p: '4px', pt: 0, pb: '0px !important' }}>
          <TransactionsTable transactions={transactions} />
        </CardContent>
      </Card>
    </>
  );
}
