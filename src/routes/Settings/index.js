import React from 'react';

import Grid from '@mui/material/Grid2';

export default function Settings() {
  return (
    <Grid
      container
      spacing={1}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', px: 1 }}
    >
      <Grid size={{ xs: 12 }}>Expense Categories</Grid>
    </Grid>
  );
}
