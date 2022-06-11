import React from 'react';
import { Grid } from '@mui/material';

import NetWorthContainer from '../../components/containers/NetWorthContainer';
import AssetsContainer from '../../components/containers/AssetsContainer';
import DebtsContainer from '../../components/containers/DebtsContainer';

export default function Networth() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ mb: '2rem', mt: '2rem' }}>
        <NetWorthContainer />
      </Grid>
      <Grid item xs={6}>
        <AssetsContainer />
      </Grid>
      <Grid item xs={6}>
        <DebtsContainer />
      </Grid>
      {/* <Grid item xs={12} sx={{ mt: '2rem' }}>
        <NetworthChart />
      </Grid> */}
    </Grid>
  );
}
