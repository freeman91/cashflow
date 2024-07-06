import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import { TransactionBox } from '../TransactionBox';
import { findAmount, findId } from '../../helpers/transactions';
import SortMenuButton from './options/SortMenuButton';

function TransactionsDialog() {
  const dispatch = useDispatch();
  const { id, attrs } = useSelector((state) => state.dialogs.transactions);

  const [transactions, setTransactions] = useState([]);
  const [sortAmount, setSortAmount] = useState('desc');

  useEffect(() => {
    if (sortAmount === '') {
      setTransactions(map(attrs, (transaction) => transaction));
    }
    if (sortAmount === 'asc') {
      setTransactions(
        map(attrs, (transaction) => transaction).sort(
          (a, b) => findAmount(a) - findAmount(b)
        )
      );
    } else if (sortAmount === 'desc') {
      setTransactions(
        map(attrs, (transaction) => transaction).sort(
          (a, b) => findAmount(b) - findAmount(a)
        )
      );
    }
  }, [attrs, sortAmount]);

  const handleClose = () => {
    dispatch(closeDialog('transactions'));
  };

  return (
    <BaseDialog type='transactions' title={id} handleClose={handleClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Stack spacing={1} width='100%'>
          <SortMenuButton selected={sortAmount} setSelected={setSortAmount} />
        </Stack>
        <Stack spacing={1} direction='column' width='100%'>
          {map(transactions, (transaction) => {
            return (
              <TransactionBox
                key={findId(transaction)}
                transaction={transaction}
              />
            );
          })}
        </Stack>
      </Box>
    </BaseDialog>
  );
}

export default TransactionsDialog;
