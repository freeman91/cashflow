import React from 'react';
import ListItemText from '@mui/material/ListItemText';

import TransactionListItem from '../../routes/Transactions/ListItems/TransactionListItem';

function TransactionsList(props) {
  const { attrs } = props;
  const { label, transactions } = attrs;

  return (
    <>
      <ListItemText
        primary={label}
        slotProps={{ primary: { align: 'center', variant: 'h6' } }}
      />
      {transactions.map((transaction, idx) => {
        return <TransactionListItem key={idx} transaction={transaction} />;
      })}
    </>
  );
}

export default TransactionsList;
