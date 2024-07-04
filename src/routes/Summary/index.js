import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import get from 'lodash/get';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import YearPage from './Year';
import MonthPage from './Month';
import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';

export default function Summary() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    const today = dayjs();
    const _year = get(location.pathname.split('/'), '2', today.year());
    const _month = get(location.pathname.split('/'), '3', null);

    setYear(Number(_year));
    setMonth(Number(_month));
  }, [location]);

  useEffect(() => {
    dispatch(
      setAppBar({
        title: 'summary',
        leftAction: <BackButton onClick={() => dispatch(push('/dashboard'))} />,
        // rightAction: null,
      })
    );
  }, [dispatch]);

  const renderComponent = () => {
    if (year) {
      if (month) {
        return <MonthPage year={year} month={month} />;
      }
      return <YearPage year={year} />;
    }
    return null;
  };

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
      >
        {renderComponent()}
      </Grid>
    </Box>
  );
}
