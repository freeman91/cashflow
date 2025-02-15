import React, { useState } from 'react';
import dayjs from 'dayjs';

import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import useMonthInflows from '../../store/hooks/useMonthInflows';
import useMonthOutflows from '../../store/hooks/useMonthOutflows';
import IncomeValuesCard from './IncomeValuesCard';
import ExpenseValuesCard from './ExpenseValuesCard';
import NetValuesCard from './NetValuesCard';
import ByMonthChart from './ByMonthChart';
import IncomeBreakdown from './IncomeBreakdown';
import ExpenseBreakdown from './ExpenseBreakdown';
import SankeyChart from './SankeyChart';

export default function MonthReport() {
  const [date, setDate] = useState(dayjs());
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { earnedIncomes, passiveIncomes, otherIncomes } = useMonthInflows(
    date.year(),
    date.month()
  );
  const {
    principalSum,
    interestSum,
    escrowSum,
    otherExpenseSum,
    expenses,
    repayments,
  } = useMonthOutflows(date.year(), date.month());

  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  return (
    <>
      <ByMonthChart year={date.year()} month={date.month()} />
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isMobile ? 'space-between' : 'flex-start',
            gap: 2,
          }}
        >
          <IconButton onClick={() => setDate(date.subtract(1, 'month'))}>
            <ArrowBackIosNew />
          </IconButton>
          <DatePicker
            size='medium'
            value={date}
            onChange={(value) => {
              setDate(value.date(15));
            }}
            format='MMMM YYYY'
            views={['month', 'year']}
            slotProps={{
              textField: {
                variant: 'standard',
              },
            }}
          />

          <IconButton onClick={() => setDate(date.add(1, 'month'))}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <IncomeValuesCard
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      </Grid>
      <Grid
        size={{ md: 4 }}
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <NetValuesCard totalIncome={totalIncome} totalExpense={totalExpense} />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <ExpenseValuesCard
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          otherExpenseSum={otherExpenseSum}
        />
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: {
            xs: 'block',
            md: 'none',
          },
        }}
      >
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
        sx={{
          px: 2,
          pb: 10,
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
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
