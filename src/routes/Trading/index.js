import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SpyChart from './SpyChart';

export default function Trading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={3}>
        <SpyChart />
      </Grid>
    </Box>
  );
}
