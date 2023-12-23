import React from 'react';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import NewTransactionButton from '../../components/NewTransactionButton';
import PaycheckDefaults from './PaycheckDefaults';
import IncomesTable from './IncomesTable';

export default function Income() {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Grid item xs={12} md={6}>
          <IncomesTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <PaycheckDefaults />
        </Grid>
      </Grid>
      <NewTransactionButton transactionTypes={['income', 'paycheck']} />
    </Box>
  );
}
