import React from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { findId } from '../helpers/transactions';
import ItemBox from './ItemBox';

const TransactionsGridStack = (props) => {
  const { transactions } = props;
  return transactions.map((transaction) => {
    const key = findId(transaction);
    return (
      <Grid item xs={12} key={key} mx={1}>
        <Card sx={{ width: '100%', py: 0.5 }}>
          <ItemBox item={transaction} />
        </Card>
      </Grid>
    );
  });
};

export default TransactionsGridStack;
