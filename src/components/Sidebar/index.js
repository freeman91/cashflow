import React from 'react';

import { Grid } from '@mui/material';
import NetWorth from './NetWorth';
import MonthStats from './MonthStats';
import UpcomingBills from './UpcomingBills';

function Sidebar() {
  return (
    <Grid container spacing={3} sx={{ width: 400, ml: 2, mt: 1 }}>
      <Grid item xs={12}>
        <NetWorth />
      </Grid>
      <Grid item xs={12}>
        <MonthStats />
      </Grid>
      <Grid item xs={12}>
        <UpcomingBills />
      </Grid>
    </Grid>
  );
}

export default Sidebar;
