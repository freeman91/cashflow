import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Transactions from './Transactions';
import Spending from './Spending';
import Budget from './Budget';
import NetWorth from './NetWorth';

export default function DesktopDashboard() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' spacing={1} my={1.5} px={2} sx={{ width: '100%' }}>
        <Typography variant='h5' fontWeight='bold' sx={{ flexGrow: 1, ml: 1 }}>
          Dashboard
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        alignItems='flex-start'
        px={2}
        sx={{ width: '100%', maxWidth: '1500px', margin: 'auto' }}
      >
        <Grid item md={6} xs={12}>
          <Grid container>
            <Budget />
            <NetWorth />
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <Grid container>
            <Spending />
            <Transactions />
          </Grid>
        </Grid>
        <Grid item xs={12} mb={5} />
      </Grid>
    </Box>
  );
}
