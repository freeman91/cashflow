import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../../../helpers/currency';
import { findAmount, findId } from '../../../../helpers/transactions';
import { useSelector } from 'react-redux';

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

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allBudgets = useSelector((state) => state.budgets.data);

  const [incomeBudget, setIncomeBudget] = useState(0);
  const [incomeActual, setIncomeActual] = useState(0);
  const [expensesBudget, setExpensesBudget] = useState(0);
  const [expensesActual, setExpensesActual] = useState(0);
  const [monthProgress, setMonthProgress] = useState(0);

  useEffect(() => {
    const expenseTotal = [...allExpenses, ...allRepayments].reduce(
      (acc, expense) => {
        const eDate = dayjs(expense.date);
        if (eDate.isSame(today, 'month') && expense?.pending === false) {
          return acc + findAmount(expense);
        }
        return acc;
      },
      0
    );
    setExpensesActual(expenseTotal);
  }, [allExpenses, allRepayments, today]);

  useEffect(() => {
    const incomeTotal = [...allIncomes, ...allPaychecks].reduce(
      (acc, income) => {
        const iDate = dayjs(income.date);
        const id = findId(income);
        if (
          iDate.isSame(today, 'month') &&
          !id.includes('template') &&
          !income?.pending
        ) {
          return acc + findAmount(income);
        }
        return acc;
      },
      0
    );

    setIncomeActual(incomeTotal);
  }, [allIncomes, allPaychecks, today]);

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

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          backgroundColor: 'surface.250',
          borderRadius: 1,
          px: 2,
          py: 1,
          boxShadow: (theme) => theme.shadows[4],
        }}
      >
        <Typography
          variant='body1'
          fontWeight='bold'
          color='text.secondary'
          sx={{ py: 1 }}
        >
          BUDGET
        </Typography>
        <Typography variant='h5' fontWeight='bold'>
          January 2025
        </Typography>
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
              <Typography variant='body2' color='text.secondary'>
                Goal
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(incomeBudget)}
              </Typography>
            </Box>
          </Box>

          <FullBar>
            <FillBar
              fillValue={incomeActual}
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
              {numberToCurrency.format(incomeActual)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant='body2' color='text.secondary'>
                Remaining
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(incomeBudget - incomeActual)}
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
              <Typography variant='body2' color='text.secondary'>
                Goal
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(expensesBudget)}
              </Typography>
            </Box>
          </Box>
          <FullBar>
            <FillBar
              fillValue={expensesActual}
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
              {numberToCurrency.format(expensesActual)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant='body2' color='text.secondary'>
                Remaining
              </Typography>
              <Typography variant='h6'>
                {numberToCurrency.format(expensesBudget - expensesActual)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
