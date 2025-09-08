import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import Grid from '@mui/material/Grid2';

import TransactionsTable, {
  TRANSACTION_ORDER,
} from '../../../components/TransactionsTable';
import { findAmount } from '../../../helpers/transactions';

export default function Transactions() {
  const allBorrows = useSelector((state) => state.borrows.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allRecurrings = useSelector((state) => state.recurrings.data);
  const allSales = useSelector((state) => state.sales.data);
  const [range] = useState({
    start: dayjs().subtract(7, 'day'),
    end: dayjs(),
  });
  const [transactionsByDay, setTransactionsByDay] = useState([]);
  const [recurrings, setRecurrings] = useState([]);

  useEffect(() => {
    const filteredRecurrings = filter(allRecurrings, (recurring) => {
      return recurring.active;
    });
    setRecurrings(filteredRecurrings);
  }, [allRecurrings]);

  useEffect(() => {
    const pendingStart = dayjs().subtract(1, 'month').startOf('day');
    const pendingEnd = dayjs().add(3, 'day').endOf('day');
    const currentDay = dayjs().endOf('day');
    const yesterday = dayjs().subtract(1, 'day').startOf('day');

    let _days = [];
    let _allTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
      ...allPurchases,
      ...allSales,
      ...allBorrows,
    ];
    _allTransactions = _allTransactions.concat(recurrings);

    let currentDate = pendingStart;
    while (currentDate <= pendingEnd) {
      const stableDate = currentDate;
      let dayTransactions = _allTransactions.filter((transaction) => {
        const transactionDate = transaction.date || transaction.next_date;
        if (transaction.pending) {
          return dayjs(transactionDate).isSame(stableDate, 'day');
        }
        if (
          yesterday.isSame(stableDate, 'day') ||
          currentDay.isSame(stableDate, 'day')
        ) {
          return dayjs(transactionDate).isSame(stableDate, 'day');
        }
        return false;
      });
      dayTransactions = dayTransactions.map((transaction) => ({
        ...transaction,
        _amount: findAmount(transaction),
      }));
      dayTransactions = dayTransactions.sort((a, b) => {
        return (
          TRANSACTION_ORDER.indexOf(a._type) -
            TRANSACTION_ORDER.indexOf(b._type) || b._amount - a._amount
        );
      });
      _days.push({
        date: currentDate,
        transactions: dayTransactions,
      });
      currentDate = dayjs(currentDate).add(1, 'day');
    }
    setTransactionsByDay(_days.reverse());
  }, [
    allExpenses,
    allRepayments,
    allIncomes,
    allPaychecks,
    allPurchases,
    allSales,
    allBorrows,
    recurrings,
    range,
  ]);

  return (
    <Grid size={{ xs: 12 }}>
      <TransactionsTable transactionsByDay={transactionsByDay} />
    </Grid>
  );
}
