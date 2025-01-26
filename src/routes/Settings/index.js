import React from 'react';

import Grid from '@mui/material/Grid2';
import CategoryList from './CategoryList';

export default function Settings() {
  return (
    <Grid
      container
      spacing={1}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ width: '100%', maxWidth: '800px', margin: 'auto', px: 1 }}
    >
      <CategoryList categoryType='expense' label='Expense Categories' />
    </Grid>
  );
}
