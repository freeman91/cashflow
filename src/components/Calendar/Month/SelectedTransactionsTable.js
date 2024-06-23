import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import TransactionsTable from './TransactionsTable';

export default function SelectedTransactions(props) {
  const { selectedTransactions } = props;

  if (!selectedTransactions.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '50%',
        }}
      >
        <Typography>no transactions</Typography>
      </Box>
    );
  }

  return (
    <Card raised sx={{ mt: 1, mb: 9 }}>
      <CardContent sx={{ p: '4px', pt: 0, pb: '0px !important' }}>
        <TransactionsTable transactions={selectedTransactions} />
      </CardContent>
    </Card>
  );
}
