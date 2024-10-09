import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import Grid from '@mui/material/Grid';

import { findAmount } from '../../../helpers/transactions';
import { getExpenses } from '../../../store/expenses';
import { getPaychecks } from '../../../store/paychecks';
import { getIncomes } from '../../../store/incomes';
import MonthlyBreakdown from './MonthlyBreakdown';
import MonthlyLineChart from './MonthlyLineChart';
import CashflowContainer from '../../../components/CashflowContainer';

export const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function YearOverview(props) {
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

  return (
    <>
      <CashflowContainer
        dateStr={year}
        incomeSum={incomeSum}
        expenseSum={expenseSum}
        principalSum={principalSum}
      />
      <MonthlyLineChart
        incomeSumByMonth={incomeSumByMonth}
        expenseSumByMonth={expenseSumByMonth}
      />
      <Grid
        item
        xs={12}
        mx={1}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <MonthlyBreakdown
          year={year}
          incomeSumByMonth={incomeSumByMonth}
          expenseSumByMonth={expenseSumByMonth}
        />
      </Grid>
    </>
  );
}
