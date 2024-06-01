import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import get from 'lodash/get';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { setAppBar } from '../../store/appSettings';

export default function Summary() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    const today = dayjs();
    const _year = get(location.pathname.split('/'), '2', today.year());
    const _month = get(location.pathname.split('/'), '3', null);
    setYear(_year);
    setMonth(_month);
  }, [location]);

  useEffect(() => {
    dispatch(
      setAppBar({
        title: 'summary',
        // leftAction: null,
        // rightAction: null,
      })
    );
  }, [dispatch]);

  console.log('month: ', month);

  return (
    <Grid
      container
      spacing={1}
      sx={{
        pl: 1,
        pr: 1,
        pt: 1,
        mb: 8,
      }}
    >
      <Grid item xs={12}>
        <Typography variant='body1' align='center' fontWeight='bold'>
          {year}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body1' align='center'>
          Totals
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body1' align='center'>
          List of Months
        </Typography>
      </Grid>
    </Grid>
  );
}
