import React from 'react';
import { Grid } from '@mui/material';
import Week from '../../components/Calendar/Week';

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Week />
      </Grid>
    </Grid>
  );
}
