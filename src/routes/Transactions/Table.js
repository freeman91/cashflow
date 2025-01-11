import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { findAmount } from '../../helpers/transactions';
import TransactionListItem from './ListItems/TransactionListItem';

export const TRANSACTION_ORDER = [
  'income',
  'paycheck',
  'repayment',
  'expense',
  'transfer',
  'borrow',
  'purchase',
  'sale',
];

export default function DesktopTransactionsTable(props) {
  const { range, types, borderRadius = 1 } = props;

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allBorrows = useSelector((state) => state.borrows.data);

  const [days, setDays] = useState([]);

  useEffect(() => {
    let days = [];
    let _allTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
      ...allPurchases,
      ...allSales,
      ...allBorrows,
    ].filter((transaction) => {
      if (types.length > 0 && !types.includes(transaction._type)) return false;
      return true;
    });
    let currentDate = range.start;
    while (currentDate <= range.end) {
      const stableDate = currentDate;
      let dayTransactions = _allTransactions.filter((transaction) => {
        return dayjs(transaction.date).isSame(stableDate, 'day');
      });
      days.push({
        date: currentDate,
        transactions: dayTransactions,
      });
      currentDate = dayjs(currentDate).add(1, 'day');
    }
    setDays(days.reverse());
  }, [
    allExpenses,
    allRepayments,
    allIncomes,
    allPaychecks,
    allPurchases,
    allSales,
    allBorrows,
    types,
    range,
  ]);

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          backgroundColor: 'surface.250',
          borderRadius,
          boxShadow: (theme) => theme.shadows[4],
          overflow: 'hidden',
        }}
      >
        <List disablePadding>
          {days.map((day, idx) => {
            if (day.transactions.length === 0) return null;
            let dayTransactions = day.transactions;
            dayTransactions = dayTransactions.map((transaction) => ({
              ...transaction,
              _amount: findAmount(transaction),
            }));

            dayTransactions = dayTransactions.sort(
              (a, b) =>
                TRANSACTION_ORDER.indexOf(a._type) -
                  TRANSACTION_ORDER.indexOf(b._type) || a._amount - b._amount
            );

            return (
              <React.Fragment key={idx}>
                <ListItem key={idx} sx={{ backgroundColor: 'surface.300' }}>
                  <ListItemText
                    primary={day.date.format('MMM Do, YYYY')}
                    slotProps={{
                      primary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
                {dayTransactions.map((transaction, idx) => {
                  return (
                    <TransactionListItem key={idx} transaction={transaction} />
                  );
                })}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Grid>
  );
}
