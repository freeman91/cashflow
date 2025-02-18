import React, { useContext, useState } from 'react';
import dayjs from 'dayjs';

import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';

import MonthReport from './MonthReport';
import YearReport from './YearReport';
import { ReportsViewContext } from '../../store/contexts/ReportsViewContext';

export default function Reports() {
  const [date, setDate] = useState(dayjs());
  const { view } = useContext(ReportsViewContext);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
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
