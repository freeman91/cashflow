import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getExpenses } from '../../../store/expenses';
import { getPaychecks } from '../../../store/paychecks';
import { getIncomes } from '../../../store/incomes';
import Cashflow from './Cashflow';
import MonthlyBreakdownTable from './MonthlyBreakdownTable';
import MonthlyLineChart from './MonthlyLineChart';

export default function YearSummary(props) {
  const { year } = props;
  const dispatch = useDispatch();

  const [date, setDate] = useState(null);
  const [incomeSumByMonth, setIncomeSumByMonth] = useState([]);
  const [expenseSumByMonth, setExpenseSumByMonth] = useState([]);

  const today = dayjs();

  useEffect(() => {
    setDate(dayjs().year(year));

    const start = dayjs().year(year).startOf('year');
    const end = dayjs().year(year).endOf('year');

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
  }, [year, dispatch]);

  const handlePreviousYear = () => {
    const previousYear = date?.subtract(1, 'year');
    dispatch(push(`/summary/${previousYear.year()}`));
  };

  const handleNextYear = () => {
    const nextYear = date?.add(1, 'year');
    dispatch(push(`/summary/${nextYear.year()}`));
  };

  return (
    <>
      <Grid item xs={12} mt='1px'>
        <Box sx={{ background: (theme) => theme.palette.surface[400] }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <IconButton onClick={() => handlePreviousYear()}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant='h6'>{year}</Typography>
            <IconButton
              disabled={date?.isSame(today, 'year')}
              onClick={() => handleNextYear()}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Stack>
        </Box>
      </Grid>

      <MonthlyLineChart
        incomeSumByMonth={incomeSumByMonth}
        expenseSumByMonth={expenseSumByMonth}
      />

      <Grid item xs={12}>
        <Cashflow year={year} />
      </Grid>

      <Grid item xs={12} sx={{ mt: 3, mb: 10 }}>
        <MonthlyBreakdownTable
          year={year}
          incomeSumByMonth={incomeSumByMonth}
          setIncomeSumByMonth={setIncomeSumByMonth}
          expenseSumByMonth={expenseSumByMonth}
          setExpenseSumByMonth={setExpenseSumByMonth}
        />
      </Grid>
    </>
  );
}
