import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';

import { getExpenses } from '../../../../store/expenses';
import { getPaychecks } from '../../../../store/paychecks';
import { getIncomes } from '../../../../store/incomes';
import { findAmount } from '../../../../helpers/transactions';
import MonthlyBreakdown from './MonthlyBreakdown';
import MonthlyLineChart from './MonthlyLineChart';
import SummaryListItemValue from '../../SummaryListItemValue';

export const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function YearTotals(props) {
  const { year } = props;
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [incomeSumByMonth, setIncomeSumByMonth] = useState([]);
  const [expenseSumByMonth, setExpenseSumByMonth] = useState([]);
  const [incomeSum, setIncomeSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);

  useEffect(() => {
    const start = dayjs().year(year).startOf('year');
    const end = dayjs().year(year).endOf('year');

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
  }, [year, dispatch]);

  useEffect(() => {
    let yearIncomes = filter([...allIncomes, ...allPaychecks], (income) => {
      if (!income.date) return false;
      return dayjs(income.date).year() === year;
    });

    const yearSum = reduce(
      yearIncomes,
      (acc, income) => {
        return acc + findAmount(income);
      },
      0
    );
    setIncomeSum(yearSum);

    let _months = map(MONTHS, (month) => {
      let _incomes = filter(yearIncomes, (income) => {
        if (!income.date) return false;
        return dayjs(income.date).month() === month;
      });
      return reduce(_incomes, (sum, income) => sum + findAmount(income), 0);
    });
    setIncomeSumByMonth(_months);
  }, [year, allIncomes, allPaychecks, setIncomeSumByMonth]);

  useEffect(() => {
    let yearExpenses = filter(
      [...allExpenses, ...allRepayments],
      (expense) => dayjs(expense.date).year() === year && !expense.pending
    );

    const yearSum = reduce(
      yearExpenses,
      (acc, expense) => {
        return acc + findAmount(expense);
      },
      0
    );
    const _principalSum = reduce(
      yearExpenses,
      (acc, expense) => {
        return acc + get(expense, 'principal', 0);
      },
      0
    );
    setPrincipalSum(_principalSum);
    setExpenseSum(yearSum);

    let _months = map(MONTHS, (month) => {
      let _expenses = filter(
        yearExpenses,
        (expense) => dayjs(expense.date).month() === month
      );
      return reduce(_expenses, (sum, expense) => sum + findAmount(expense), 0);
    });

    setExpenseSumByMonth(_months);
  }, [year, allExpenses, allRepayments, setExpenseSumByMonth]);

  const nonPrincipalSum = expenseSum - principalSum;
  const max = Math.max(incomeSum, expenseSum);
  const incomePercent = (incomeSum / max) * 100;
  const expensePercent = (expenseSum / max) * 100;

  return (
    <>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%', pb: 1 }}>
          <SummaryListItemValue
            value={incomeSum - expenseSum}
            label='cashflow'
          />
          <SummaryListItemValue value={incomeSum} label='earned' />
          <ListItem>
            <Box
              sx={{
                width: `${incomePercent}%`,
                borderRadius: '5px',
                backgroundColor: 'success.main',
                height: '10px',
              }}
            />
          </ListItem>
          <SummaryListItemValue value={expenseSum} label='spent' />
          <ListItem>
            <Box
              sx={{
                width: `${expensePercent}%`,
                height: '10px',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  width: `${(nonPrincipalSum / expenseSum) * 100}%`,
                  backgroundColor: 'error.main',
                  height: '10px',
                  borderRadius: '5px',
                }}
              />
              <Box
                sx={{
                  width: `${(principalSum / expenseSum) * 100}%`,
                  backgroundColor: 'red.200',
                  height: '10px',
                  borderRadius: '5px',
                }}
              />
            </Box>
          </ListItem>
        </Card>
      </Grid>
      <MonthlyLineChart
        incomeSumByMonth={incomeSumByMonth}
        expenseSumByMonth={expenseSumByMonth}
      />
      <MonthlyBreakdown
        year={year}
        incomeSumByMonth={incomeSumByMonth}
        expenseSumByMonth={expenseSumByMonth}
      />
    </>
  );
}
