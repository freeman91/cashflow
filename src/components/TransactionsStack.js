import React from 'react';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import TransactionBox from './TransactionBox';

export default function TransactionsStack(props) {
  const { transactions } = props;
  return (
    <Card sx={{ width: '100%', mx: 1 }}>
      <Stack spacing={1} direction='column' pt={1} pb={1}>
        {map(transactions, (transaction, idx) => {
          return (
            <React.Fragment key={transaction.transaction_id}>
              <TransactionBox transaction={transaction} />
              {idx < transactions.length - 1 && (
                <Divider sx={{ mx: '8px !important' }} />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Card>
  );
}
