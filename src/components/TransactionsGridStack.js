import React from 'react';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { findId } from '../helpers/transactions';
import TransactionBox from './TransactionBox';

const TransactionsGridStack = (props) => {
  const { transactions } = props;
  return (
    <Grid
      item
      xs={12}
      mx={1}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Card sx={{ maxWidth: 650, width: '100%' }}>
        <Stack spacing={1} direction='column' pt={1} pb={1}>
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
    </Grid>
  );
};

export default TransactionsGridStack;
