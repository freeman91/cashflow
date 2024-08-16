import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { getExpenses } from '../../../store/expenses';
import { getPaychecks } from '../../../store/paychecks';
import { getIncomes } from '../../../store/incomes';
import Cashflow from './Cashflow';
import MonthlyBreakdown from './MonthlyBreakdown';
import MonthlyLineChart from './MonthlyLineChart';
import { StyledTab, StyledTabs } from '../../../components/StyledTabs';
import IncomesBreakdown from '../IncomesBreakdown';
import ExpensesBreakdown from '../ExpensesBreakdown';

export const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function YearSummary(props) {
  const { year } = props;
  const today = dayjs();
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [tabIdx, setTabIdx] = useState(0);
  const [date, setDate] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [incomeSumByMonth, setIncomeSumByMonth] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseSumByMonth, setExpenseSumByMonth] = useState([]);

  useEffect(() => {
    setDate(dayjs().year(year));

    const start = dayjs().year(year).startOf('year');
    const end = dayjs().year(year).endOf('year');

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
  }, [year, dispatch]);

  useEffect(() => {
    let yearIncomes = filter(
      allIncomes,
      (income) => dayjs(income.date).year() === year
    );
    let yearPaychecks = filter(
      allPaychecks,
      (paycheck) => dayjs(paycheck.date).year() === year
    );

    setIncomes([...yearIncomes, ...yearPaychecks]);
    let _months = map(MONTHS, (month) => {
      let _incomes = filter(
        yearIncomes,
        (income) => dayjs(income.date).month() === month
      );
      let _paychecks = filter(
        yearPaychecks,
        (paycheck) => dayjs(paycheck.date).month() === month
      );
      return (
        reduce(_incomes, (sum, income) => sum + income.amount, 0) +
        reduce(_paychecks, (sum, paycheck) => sum + paycheck.take_home, 0)
      );
    });
    setIncomeSumByMonth(_months);
  }, [year, allIncomes, allPaychecks, setIncomeSumByMonth]);

  useEffect(() => {
    let yearExpenses = filter(
      allExpenses,
      (expense) => dayjs(expense.date).year() === year && !expense.pending
    );

    let yearRepayments = filter(
      allRepayments,
      (repayment) => dayjs(repayment.date).year() === year && !repayment.pending
    );

    setExpenses([...yearExpenses, ...yearRepayments]);
    let _months = map(MONTHS, (month) => {
      let _expenses = filter(
        yearExpenses,
        (expense) => dayjs(expense.date).month() === month
      );
      let _repayments = filter(
        yearRepayments,
        (repayment) => dayjs(repayment.date).month() === month
      );
      return (
        reduce(_expenses, (sum, expense) => sum + expense.amount, 0) +
        reduce(
          _repayments,
          (sum, repayment) =>
            sum +
            repayment.principal +
            repayment.interest +
            (repayment.escrow ? repayment.escrow : 0),
          0
        )
      );
    });

    setExpenseSumByMonth(_months);
  }, [year, allExpenses, allRepayments, setExpenseSumByMonth]);

  const handlePreviousYear = () => {
    const previousYear = date?.subtract(1, 'year');
    dispatch(push(`/summary/${previousYear.year()}`));
  };

  const handleNextYear = () => {
    const nextYear = date?.add(1, 'year');
    dispatch(push(`/summary/${nextYear.year()}`));
  };

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <MonthlyLineChart
        incomeSumByMonth={incomeSumByMonth}
        expenseSumByMonth={expenseSumByMonth}
      />

      <Grid
        item
        xs={12}
        mx={2}
        sx={{ position: 'relative', top: 25, height: 0 }}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mx={1}
        >
          <Card
            raised
            sx={{ backgroundImage: 'unset', bgcolor: 'surface.300' }}
          >
            <IconButton
              onClick={() => handlePreviousYear()}
              sx={{ ml: '4px', pl: 1, pr: 0, mr: '4px' }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          </Card>
          <Card
            raised
            sx={{ backgroundImage: 'unset', bgcolor: 'surface.300' }}
          >
            <IconButton
              disabled={date?.isSame(today, 'year')}
              onClick={() => handleNextYear()}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Card>
        </Stack>
      </Grid>

      <Grid item xs={12} pt={'0 !important'}>
        <Cashflow year={year} />
      </Grid>

      <Grid item xs={12} sx={{ mb: 9, mt: 1 }}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='net' sx={{ width: '30%' }} />
          <StyledTab label='incomes' sx={{ width: '30%' }} />
          <StyledTab label='expenses' sx={{ width: '30%' }} />
        </StyledTabs>
        <Box sx={{ mt: '2px' }}>
          {tabIdx === 0 && (
            <MonthlyBreakdown
              year={year}
              incomeSumByMonth={incomeSumByMonth}
              expenseSumByMonth={expenseSumByMonth}
            />
          )}
          {tabIdx === 1 && <IncomesBreakdown incomes={incomes} />}
          {tabIdx === 2 && <ExpensesBreakdown expenses={expenses} />}
        </Box>
      </Grid>
    </>
  );
}
