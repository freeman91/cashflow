import React, { useState } from 'react';
import dayjs from 'dayjs';

import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import useYearInflows from '../../../store/hooks/useYearInflows';
import useYearOutflows from '../../../store/hooks/useYearOutflows';
import ByMonthChart from '../ByMonthChart';
import IncomeValuesCard from '../IncomeValuesCard';
import ExpenseValuesCard from '../ExpenseValuesCard';
import NetValuesCard from '../NetValuesCard';
import IncomeBreakdown from '../IncomeBreakdown';
import ExpenseBreakdown from '../ExpenseBreakdown';
import SankeyChart from '../SankeyChart';

export default function YearReport({ date: propDate, setDate: propSetDate }) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [localDate, setLocalDate] = useState(dayjs().month(11).date(15));

  // Use prop date if provided, otherwise use local date
  const date = propDate || localDate;
  const setDate = propSetDate || setLocalDate;

  const { earnedIncomes, passiveIncomes, otherIncomes } = useYearInflows(
    date.year()
  );

  const {
    principalSum,
    interestSum,
    escrowSum,
    otherExpenseSum,
    expenses,
    repayments,
  } = useYearOutflows(date.year());

  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;

  const handleDateChange = (value) => {
    const newDate = value.month(11).date(15);
    setDate(newDate);
  };

  const handlePrevYear = () => {
    setDate(date.subtract(1, 'year'));
  };

  const handleNextYear = () => {
    setDate(date.add(1, 'year'));
  };

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-start',
            alignItems: 'center',
            gap: 2,
            mx: 2,
          }}
        >
          <DatePicker
            size='medium'
            value={date}
            onChange={handleDateChange}
            format='YYYY'
            views={['year']}
            sx={{ width: 160 }}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                inputProps: { style: { fontSize: 20 } },
              },
              inputAdornment: {
                position: 'start',
              },
            }}
          />
          <Box>
            <IconButton onClick={handlePrevYear}>
              <ArrowBack />
            </IconButton>
            <IconButton
              onClick={handleNextYear}
              disabled={dayjs().year() === date.year()}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      <ByMonthChart year={date.year()} />
      <IncomeValuesCard
        date={date}
        earnedIncomes={earnedIncomes}
        passiveIncomes={passiveIncomes}
        otherIncomes={otherIncomes}
        showPending={false}
      />
      <Grid size={{ md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
        <NetValuesCard totalIncome={totalIncome} totalExpense={totalExpense} />
      </Grid>
      <ExpenseValuesCard
        date={date}
        principalSum={principalSum}
        interestSum={interestSum}
        escrowSum={escrowSum}
        otherExpenseSum={otherExpenseSum}
        showPending={false}
      />
      <Grid size={{ xs: 12 }} sx={{ display: { xs: 'block', md: 'none' } }}>
        <NetValuesCard totalIncome={totalIncome} totalExpense={totalExpense} />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <IncomeBreakdown
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <ExpenseBreakdown expenses={expenses} repayments={repayments} />
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{ px: 2, pb: 10, display: { xs: 'none', md: 'block' } }}
      >
        <SankeyChart
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
          expenses={expenses}
          repayments={repayments}
        />
      </Grid>
    </>
  );
}
