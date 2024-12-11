import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { findId } from '../../helpers/transactions';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import TransactionBox from '../TransactionBox';

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
        }}
      >
        <Card sx={{ width: '100%' }}>
          <Stack spacing={1} direction='column' width='100%' py={1}>
            {map(transactions, (transaction, idx) => {
              const key = findId(transaction);
              return (
                <React.Fragment key={key}>
                  <TransactionBox transaction={transaction} />
                  {idx < transactions.length - 1 && (
                    <Divider sx={{ mx: '8px !important' }} />
                  )}
                </React.Fragment>
              );
            })}
          </Stack>
        </Card>
      </Box>
    </BaseDialog>
  );
}

export default TransactionsDialog;
