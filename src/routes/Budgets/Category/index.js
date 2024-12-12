import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CustomAppBar from '../../../components/CustomAppBar';
import { getExpenses } from '../../../store/expenses';
import { findAmount } from '../../../helpers/transactions';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import { _numberToCurrency, numberToCurrency } from '../../../helpers/currency';
import FullBar from '../FullBar';
import FillBar from '../FillBar';
import OverageBar from '../OverageBar';
import MonthCategory from './MonthCategory';

export default function BudgetCategory() {
  const location = useLocation();
  const dispatch = useDispatch();
  const today = dayjs().add(1, 'month');

  const budgets = useSelector((state) => state.budgets.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const expenseCategories = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const [date] = useState(today);
  const [start] = useState(date.subtract(12, 'month').startOf('month'));
  const [end] = useState(date.endOf('month'));
  const [category, setCategory] = useState(null);
  const [budgetGoalsByMonth, setBudgetGoalsByMonth] = useState([]);
  const [average, setAverage] = useState(null);
  const [barMax, setBarMax] = useState(100);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (expenseCategories) {
      const _category = find(expenseCategories.categories, {
        name: category,
      });
      setColor(_category?.color);
    }
  }, [expenseCategories, category]);

  useEffect(() => {
    let _category = location.pathname.split('/')[2];
    if (_category) {
      setCategory(_category);
    }
  }, [location]);

  useEffect(() => {
    dispatch(getExpenses({ range: { start, end } }));
  }, [start, end, dispatch]);

  useEffect(() => {
    let _budgetGoalsByMonth = [];
    let currentDate = start;
    while (currentDate.isBefore(end)) {
      const stableDate = currentDate;
      let monthGoal = null;

      let monthBudget = find(budgets, (budget) => {
        return dayjs(budget.date).isSame(stableDate, 'month');
      });
      if (monthBudget) {
        const monthBudgetCategory = find(
          monthBudget.categories,
          (_category) => {
            return _category.category === category;
          }
        );
        monthGoal = monthBudgetCategory?.goal || null;
      }
      let _expenses = [...allExpenses, ...allRepayments].filter((expense) => {
        return (
          dayjs(expense.date).isSame(stableDate, 'month') &&
          expense.category === category &&
          !expense.pending
        );
      });
      _budgetGoalsByMonth.push({
        date: currentDate,
        expenses: _expenses,
        expenseSum: _expenses.reduce(
          (acc, expense) => acc + findAmount(expense),
          0
        ),
        goal: monthGoal,
      });
      currentDate = currentDate.add(1, 'month');
    }
    let _maxMonth = _budgetGoalsByMonth.reduce((acc, month) => {
      return Math.max(acc, month.expenseSum, month.goal);
    }, 0);
    setBarMax(_maxMonth);
    setBudgetGoalsByMonth(_budgetGoalsByMonth.reverse());
  }, [allExpenses, allRepayments, start, end, category, budgets]);

  useEffect(() => {
    let _average = {};
    let count = 0;
    _average = budgetGoalsByMonth.reduce(
      (acc, month) => {
        if (month.date.isSameOrAfter(date, 'month')) {
          return acc;
        }
        count++;
        const monthExpenseSum = month.expenseSum || 0;
        const monthGoal = month.goal || 0;
        return {
          expenseSum: acc.expenseSum + monthExpenseSum,
          goal: acc.goal + monthGoal,
        };
      },
      {
        expenseSum: 0,
        goal: 0,
      }
    );
    _average.expenseSum =
      Math.round((_average.expenseSum / count) * 100, 2) / 100;
    _average.goal = Math.round((_average.goal / count) * 100, 2) / 100;
    _average.diff =
      Math.round((_average.goal - _average.expenseSum) * 100, 2) / 100;
    setAverage(_average);
  }, [budgetGoalsByMonth, date]);

  if (!color) return null;
  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            {category}
          </Typography>
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <Grid item xs={12} mx={1}>
          <Card sx={{ width: '100%', p: 1 }}>
            <Typography
              variant='h6'
              fontWeight='bold'
              align='left'
              color='text.secondary'
            >
              Average
            </Typography>
            <Grid container>
              <Grid item xs={4}>
                <BoxFlexCenter justifyContent='flex-start'>
                  <Typography variant='body1' color='text.secondary'>
                    $
                  </Typography>
                  <Typography variant='h6' fontWeight='bold'>
                    {_numberToCurrency.format(average?.expenseSum)}
                  </Typography>
                </BoxFlexCenter>
              </Grid>
              <Grid
                item
                xs={4}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <Typography
                  variant='body1'
                  color={average?.diff >= 0 ? 'success.main' : 'error.main'}
                  fontWeight='bold'
                  align='center'
                >
                  {numberToCurrency.format(average?.diff)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <BoxFlexCenter justifyContent='flex-end'>
                  <Typography variant='body1' color='text.secondary'>
                    $
                  </Typography>
                  <Typography variant='h6' fontWeight='bold'>
                    {_numberToCurrency.format(average?.goal)}
                  </Typography>
                </BoxFlexCenter>
              </Grid>
            </Grid>
            <FullBar>
              <FillBar
                fillValue={
                  average?.diff < 0 ? average?.goal : average?.expenseSum
                }
                goalSum={average?.goal}
                color={color}
                barMax={barMax}
              />
              <OverageBar
                expenseSum={average?.expenseSum}
                goal={average?.goal}
                barMax={barMax}
              />
            </FullBar>
          </Card>
        </Grid>
        {budgetGoalsByMonth.map((month) => {
          return (
            <MonthCategory
              key={month.date}
              category={category}
              date={month.date}
              goal={month.goal}
              expenseSum={month.expenseSum}
              barMax={barMax}
              color={color}
            />
          );
        })}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
