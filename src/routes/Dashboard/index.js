import React from 'react';

import Grid from '@mui/material/Grid2';

import Transactions from './Transactions';
import Spending from './Spending';
import Budget from './Budget';
import NetWorth from './NetWorth';

export default function Dashboard() {
  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        width: '100%',
        maxWidth: '1500px',
        margin: 'auto',
        px: 1,
      }}
    >
      <Grid size={{ md: 6, xs: 12 }}>
        <Grid container spacing={2}>
          <Transactions />
          <Budget />
        </Grid>
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <Grid container spacing={2}>
          <Spending />
          <NetWorth />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }} mb={10} />
    </Grid>
  );
}
