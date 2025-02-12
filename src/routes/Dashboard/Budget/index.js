import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../../helpers/currency';
import { useMonthInflows } from '../../../store/hooks/useMonthInflows';
import { useMonthOutflows } from '../../../store/hooks/useMonthOutflows';

function FullBar({ children }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 10,
        display: 'flex',
        alignItems: 'flex-start',
        my: 1,
        backgroundColor: 'surface.300',
        borderRadius: 1,
      }}
    >
      {children}
    </Box>
  );
}

function FillBar({ fillValue, goalSum, color, barMax = null }) {
  const _barMax = barMax || Math.max(fillValue, goalSum, 100);
  return (
    <Box
      sx={{
        width: `${(fillValue / _barMax) * 100}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
  );
}

function CurrentDayIndicator({ progress }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        left: `${progress}%`,
        height: 0,
      }}
    >
      <Box
        sx={{
          top: '-22px',
          position: 'relative',
          left: `${progress}%`,
          width: '2px',
          height: '20px',
          backgroundColor: alpha(theme.palette.text.primary, 0.75),
          borderRadius: '2px',
        }}
      />
    </Box>
  );
}

export default function Budget() {
  const theme = useTheme();
  const today = dayjs();

  const allBudgets = useSelector((state) => state.budgets.data);
  const { earnedIncomes, passiveIncomes, otherIncomes } = useMonthInflows(
    today.year(),
    today.month()
  );
  const { principalSum, interestSum, escrowSum, otherExpenseSum } =
    useMonthOutflows(today.year(), today.month());

  const [incomeBudget, setIncomeBudget] = useState(0);
  const [expensesBudget, setExpensesBudget] = useState(0);
  const [monthProgress, setMonthProgress] = useState(0);

  useEffect(() => {
    const monthBudget = allBudgets.find(
      (budget) =>
        budget.month === today.month() + 1 && budget.year === today.year()
    );

    if (!monthBudget) return;

    // TODO: Add income budget
    setIncomeBudget(4850);
    setExpensesBudget(
      monthBudget?.categories?.reduce((acc, category) => acc + category.goal, 0)
    );
  }, [allBudgets, today]);

  useEffect(() => {
    const daysInMonth = today.daysInMonth();
    setMonthProgress((today.date() / daysInMonth) * 100);
  }, [today]);

  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  const cashflow = totalIncome - totalExpense;
  const cashflowColor = (() => {
    if (cashflow > 0) return theme.palette.success.main;
    if (cashflow < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  })();

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant='body1'
            fontWeight='bold'
            color='textSecondary'
            sx={{ py: 1 }}
          >
            BUDGET
          </Typography>
          <Typography
            variant='body1'
            fontWeight='bold'
            color='textSecondary'
            sx={{ py: 1 }}
          >
            CASHFLOW
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h5' fontWeight='bold'>
            {today.format('MMMM YYYY')}
          </Typography>
          <Typography variant='h5' fontWeight='bold' color={cashflowColor}>
            {numberToCurrency.format(cashflow)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6'>Income</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant='body2' color='textSecondary'>
                Goal
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(incomeBudget)}
              </Typography>
            </Box>
          </Box>

          <FullBar>
            <FillBar
              fillValue={totalIncome}
              goalSum={incomeBudget}
              color={theme.palette.success.main}
            />
          </FullBar>
          <CurrentDayIndicator progress={monthProgress} total={incomeBudget} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant='h6'>
              {numberToCurrency.format(totalIncome)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant='body2' color='textSecondary'>
                Remaining
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(incomeBudget - totalIncome)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6'>Expenses</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant='body2' color='textSecondary'>
                Goal
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(expensesBudget)}
              </Typography>
            </Box>
          </Box>
          <FullBar>
            <FillBar
              fillValue={totalExpense}
              goalSum={expensesBudget}
              color={theme.palette.error.main}
            />
          </FullBar>
          <CurrentDayIndicator progress={monthProgress} total={incomeBudget} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant='h6 '>
              {numberToCurrency.format(totalExpense)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant='body2' color='textSecondary'>
                Remaining
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(expensesBudget - totalExpense)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
