import React from 'react';

import Grid from '@mui/material/Grid2';

export default function Budgets() {
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
        pb: 6,
      }}
    >
      Budgets
    </Grid>
  );
}
