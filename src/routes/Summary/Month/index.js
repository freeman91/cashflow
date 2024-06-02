import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CashflowContainer from '../../../components/CashflowContainer';

export default function MonthSummary(props) {
  const { year, month } = props;
  const dispatch = useDispatch();

  const [date, setDate] = useState(dayjs());

  const today = dayjs();

  useEffect(() => {
    setDate(
      dayjs()
        .year(year)
        .month(month - 1)
    );
  }, [year, month]);

  const handleYearClick = () => {
    dispatch(push(`/summary/${year}`));
  };

  const handlePreviousMonth = () => {
    const previousMonth = date.subtract(1, 'month');
    dispatch(
      push(`/summary/${previousMonth.year()}/${previousMonth.month() + 1}`)
    );
  };

  const handleNextMonth = () => {
    const nextMonth = date.add(1, 'month');
    dispatch(push(`/summary/${nextMonth.year()}/${nextMonth.month() + 1}`));
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
                  {date.format('MMMM')}
                </Typography>
                <IconButton
                  disabled={date.isSame(today, 'month')}
                  onClick={() => handleNextMonth()}
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
          <CashflowContainer month={month} year={year} />
        </Card>
      </Grid>
    </>
  );
}
