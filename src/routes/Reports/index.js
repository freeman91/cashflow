import React, { useState } from 'react';
import dayjs from 'dayjs';
import get from 'lodash/get';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';

import MonthReport from './Month/MonthReport';
import YearReport from './Year/YearReport';
import { MONTH } from '../Layout/CustomAppBar/ReportsAppBar';
import { useLocation } from 'react-router-dom';

export default function Reports() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const location = useLocation();

  const [date, setDate] = useState(dayjs());
  const view = get(location.pathname.split('/'), '2', MONTH);

  return (
    <Grid
      container
      spacing={isMobile ? 1 : 2}
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
      {view === 'month' && <MonthReport date={date} setDate={setDate} />}
      {view === 'year' && <YearReport date={date} setDate={setDate} />}
    </Grid>
  );
}
