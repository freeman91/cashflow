import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid2';

import RecurringCalendar from './Calendar';
import RecurringList from './List';

export default function Recurring() {
  const tab = useSelector((state) => state.appSettings.recurring.tab);

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ width: '100%', maxWidth: '1500px', margin: 'auto', px: 1, mb: 5 }}
    >
      {tab === 'list' && <RecurringList />}
      {tab === 'calendar' && <RecurringCalendar />}
    </Grid>
  );
}
