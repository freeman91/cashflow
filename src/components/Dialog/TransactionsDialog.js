import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { findId } from '../../helpers/transactions';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import ItemBox from '../ItemBox';

function TransactionsDialog() {
  const dispatch = useDispatch();
  const { id, attrs } = useSelector((state) => state.dialogs.transactions);

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
      title={id}
      handleClose={handleClose}
      disableGutters
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          pb: 2,
          mt: 1,
          gap: 1,
        }}
      >
        {map(transactions, (transaction, idx) => {
          const key = findId(transaction);
          return (
            <Card sx={{ width: '100%', py: 0.5 }} key={key}>
              <ItemBox item={transaction} />
            </Card>
          );
        })}
      </Box>
    </BaseDialog>
  );
}

export default TransactionsDialog;
