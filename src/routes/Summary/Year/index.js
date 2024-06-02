import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CashflowContainer from '../../../components/CashflowContainer';
import MonthlyBreakdownTable from './MonthlyBreakdownTable';

export default function YearSummary(props) {
  const { year } = props;
  const dispatch = useDispatch();

  const [date, setDate] = useState(dayjs());
  const [incomeSumByMonth, setIncomeSumByMonth] = useState([]);
  const [expenseSumByMonth, setExpenseSumByMonth] = useState([]);

  const today = dayjs();

  useEffect(() => {
    setDate(dayjs().year(year));
  }, [year]);

  const handlePreviousYear = () => {
    const previousYear = date.subtract(1, 'year');
    dispatch(push(`/summary/${previousYear.year()}`));
  };

  const handleNextYear = () => {
    const nextYear = date.add(1, 'year');
    dispatch(push(`/summary/${nextYear.year()}`));
  };

  return (
    <>
      <Grid item xs={12}>
        <Card raised>
          <CardHeader
            title={
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
                  disabled={date.isSame(today, 'year')}
                  onClick={() => handleNextYear()}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Stack>
            }
            sx={{ p: 1, pt: 0, pb: 0 }}
            disableTypography
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card raised>
          <CashflowContainer year={year} />
        </Card>
      </Grid>
      <MonthlyBreakdownTable
        year={year}
        incomeSumByMonth={incomeSumByMonth}
        setIncomeSumByMonth={setIncomeSumByMonth}
        expenseSumByMonth={expenseSumByMonth}
        setExpenseSumByMonth={setExpenseSumByMonth}
      />
    </>
  );
}
