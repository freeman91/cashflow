import React from 'react';
import ListItemText from '@mui/material/ListItemText';

import TransactionListItem from '../../routes/Transactions/ListItems/TransactionListItem';

function TransactionsList(props) {
  const { attrs } = props;
  const { date, transactions } = attrs;

  return (
    <>
      <ListItemText primary={date?.format('MMMM Do, YYYY')} />
      {transactions.map((transaction, idx) => {
        return <TransactionListItem key={idx} transaction={transaction} />;
      })}
    </>
  );
}

export default TransactionsList;
