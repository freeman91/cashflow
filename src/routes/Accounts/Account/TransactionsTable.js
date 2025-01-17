import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import find from 'lodash/find';
import map from 'lodash/map';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { findAmount } from '../../../helpers/transactions';
import TransactionListItem from '../../Transactions/ListItems/TransactionListItem';
import { TRANSACTION_ORDER } from '../../Transactions/Table';

export default function TransactionsTable(props) {
  const { transactions } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    let days = [];
    transactions.forEach((transaction) => {
      const date = dayjs(transaction.date).format('MMMM Do, YYYY');
      const existing = find(days, { date });
      if (!existing) {
        days.push({ date, transactions: [transaction] });
      } else {
        existing.transactions.push(transaction);
      }
    });
    days = map(days, (day) => {
      let transactions = map(day.transactions, (transaction) => {
        return transaction;
      });
      return {
        ...day,
        transactions,
      };
    });
    setData(days);
  }, [transactions]);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <List
      disablePadding
      sx={{
        backgroundColor: 'surface.250',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {data.map((day, idx) => {
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
                primary={day.date}
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
  );
}
