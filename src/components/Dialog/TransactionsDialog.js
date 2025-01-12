import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import List from '@mui/material/List';

import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import TransactionListItem from '../../routes/Transactions/ListItems/TransactionListItem';

function TransactionsDialog() {
  const dispatch = useDispatch();
  const { id: date, attrs } = useSelector(
    (state) => state.dialogs.transactions
  );

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTransactions(map(attrs, (transaction) => transaction));
  }, [attrs]);

  const handleClose = () => {
    dispatch(closeDialog('transactions'));
  };

  return (
    <BaseDialog
      type='transactions'
      title={date?.format('MMMM Do, YYYY')}
      handleClose={handleClose}
      disableGutters
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '400px',
          pb: 2,
          mt: 1,
        }}
      >
        <List disablePadding>
          {transactions.map((transaction, idx) => {
            return <TransactionListItem key={idx} transaction={transaction} />;
          })}
        </List>
      </Box>
    </BaseDialog>
  );
}

export default TransactionsDialog;
