import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Month from '../../components/Calendar/Month';
import Week from '../../components/Calendar/Week';

export default function Dashboard() {
  const [view, setView] = useState('week');

  const render = () => {
    if (view === 'week') {
      return <Week setView={setView} />;
    } else if (view === 'month') {
      return <Month setView={setView} />;
    } else {
      return null;
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {render()}
        </Grid>
      </Grid>
    </>
  );
}
