import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid2';

import { findAmount } from '../helpers/transactions';
import TransactionListItem from '../routes/Transactions/ListItems/TransactionListItem';
import TransactionTypeSelect from './Selector/TransactionTypeSelect';
import RangeSelect from './Selector/RangeSelect';

export const TRANSACTION_ORDER = [
  'recurring',
  'income',
  'paycheck',
  'repayment',
  'expense',
  'transfer',
  'borrow',
  'purchase',
  'sale',
];

export default function TransactionsTable(props) {
  const { range: rangeProps, types: typesProps } = props;

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allBorrows = useSelector((state) => state.borrows.data);

  const [days, setDays] = useState([]);
  const [types, setTypes] = useState([]);
  const [range, setRange] = useState({
    id: 2,
    label: 'Custom Range',
    start: dayjs().subtract(1, 'month').startOf('month'),
    end: dayjs().add(3, 'day'),
  });

  useEffect(() => {
    if (rangeProps) {
      setRange(rangeProps);
    }
  }, [rangeProps]);

  useEffect(() => {
    if (typesProps) {
      setTypes(typesProps);
    }
  }, [typesProps]);

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
    <Grid size={{ xs: 12 }} sx={{ width: '100%', mb: 5 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <List disablePadding>
          {!rangeProps && !typesProps && (
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <RangeSelect range={range} setRange={setRange} />
              <TransactionTypeSelect types={types} setTypes={setTypes} />
            </ListItem>
          )}
          {days.map((day, idx) => {
            if (day.transactions.length === 0) return null;
            let dayTransactions = day.transactions.map((transaction) => ({
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
                <ListItem
                  key={idx}
                  sx={{
                    backgroundImage: (theme) => theme.vars.overlays[8],
                  }}
                >
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
