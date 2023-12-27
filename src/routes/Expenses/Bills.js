import React from 'react';

import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import NewTransactionButton from '../../components/NewTransactionButton';
import BillsTable from './BillsTable';

export default function Bills() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <BillsTable />
      </Stack>
      <NewTransactionButton transactionTypes={['account', 'asset', 'debt']} />
    </Box>
  );
}
