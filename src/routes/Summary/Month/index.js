import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

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
import ExpensesByCategory from './ExpensesByCategory';
import Cashflow from './Cashflow';
import { StyledTab, StyledTabs } from '../../../components/StyledTabs';
import IncomesBreakdown from '../IncomesBreakdown';
import ExpensesBreakdown from '../ExpensesBreakdown';

export default function MonthSummary(props) {
  const { year, month } = props;
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [tabIdx, setTabIdx] = useState(0);
  const [date, setDate] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

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

  useEffect(() => {
    let yearIncomes = filter(allIncomes, (income) => {
      const incomeDate = dayjs(income.date);
      return incomeDate.year() === year && incomeDate.month() === month - 1;
    });
    let yearPaychecks = filter(allPaychecks, (paycheck) => {
      const paycheckDate = dayjs(paycheck.date);
      return paycheckDate.year() === year && paycheckDate.month() === month - 1;
    });

    setIncomes([...yearIncomes, ...yearPaychecks]);
  }, [year, allIncomes, allPaychecks]);

  useEffect(() => {
    let yearExpenses = filter(allExpenses, (expense) => {
      const expenseDate = dayjs(expense.date);
      return (
        expenseDate.year() === year &&
        expenseDate.month() === month - 1 &&
        !expense.pending
      );
    });

    let yearRepayments = filter(allRepayments, (repayment) => {
      const repaymentDate = dayjs(repayment.date);
      return (
        repaymentDate.year() === year &&
        repaymentDate.month() === month - 1 &&
        !repayment.pending
      );
    });

    setExpenses([...yearExpenses, ...yearRepayments]);
  }, [year, allExpenses, allRepayments]);

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

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
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
      <Grid item xs={12} sx={{ mb: 9, mt: 3 }}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='incomes' sx={{ width: '40%' }} />
          <StyledTab label='expenses' sx={{ width: '40%' }} />
        </StyledTabs>
        <Box sx={{ mt: '2px', px: 1, pb: 1 }}>
          {tabIdx === 0 && <IncomesBreakdown incomes={incomes} />}
          {tabIdx === 1 && <ExpensesBreakdown expenses={expenses} />}
        </Box>
      </Grid>
    </>
  );
}
