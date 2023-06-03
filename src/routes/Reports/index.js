import React, { useState } from 'react';
import dayjs from 'dayjs';

import Grid from '@mui/material/Grid';

import MonthReport from './MonthReport';

export default function Reports() {
  const [date1, setDate1] = useState(dayjs().subtract(1, 'month'));
  const [date2, setDate2] = useState(dayjs());

  return (
    <Grid container spacing={1}>
      <MonthReport date={date1} setDate={setDate1} />
      <MonthReport date={date2} setDate={setDate2} />
    </Grid>
  );
}
