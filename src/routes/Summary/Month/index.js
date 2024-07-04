import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getExpenses } from '../../../store/expenses';
import { getPaychecks } from '../../../store/paychecks';
import { getIncomes } from '../../../store/incomes';
import LargestExpenses from './LargestExpenses';
import ExpensesByCategory from './ExpensesByCategory';
import Cashflow from './Cashflow';

export default function MonthSummary(props) {
  const { year, month } = props;
  const dispatch = useDispatch();

  const [date, setDate] = useState(null);
  const today = dayjs();

  useEffect(() => {
    if (!year || !month) {
      setDate(dayjs());
    }
    setDate(
      dayjs()
        .year(year)
        .month(month - 1)
    );
  }, [year, month]);

  useEffect(() => {
    if (!date) return;

    const start = date.startOf('month');
    const end = date.endOf('month');

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
  }, [date, dispatch]);

  const handleYearClick = () => {
    dispatch(push(`/summary/${year}`));
  };

  const handlePreviousMonth = () => {
    const previousMonth = date?.subtract(1, 'month');
    dispatch(
      push(`/summary/${previousMonth.year()}/${previousMonth.month() + 1}`)
    );
    setDate(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = date?.add(1, 'month');
    dispatch(push(`/summary/${nextMonth.year()}/${nextMonth.month() + 1}`));
  };

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ background: (theme) => theme.palette.surface[250] }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <IconButton onClick={() => handlePreviousMonth()}>
              <ArrowBackIosIcon />
            </IconButton>
            <Button
              sx={{ p: 0, fontSize: 20, color: '#fff' }}
              variant='text'
              onClick={() => handleYearClick()}
            >
              <Typography variant='h6'>{year}</Typography>
            </Button>
            <Typography variant='h6' sx={{ px: 2 }}>
              {date?.format('MMMM')}
            </Typography>
            <IconButton
              disabled={date?.isSame(today, 'month')}
              onClick={() => handleNextMonth()}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} pt='0 !important'>
        <ExpensesByCategory year={year} month={month} />
      </Grid>
      <Grid item xs={12}>
        <Cashflow year={year} month={month} />
      </Grid>
      <Grid item xs={12} mt={3} mb={10}>
        <LargestExpenses year={year} month={month} />
      </Grid>
    </>
  );
}
