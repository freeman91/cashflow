import React, { useEffect, useState } from 'react';

import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { findAmount } from '../../helpers/transactions';
import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import CategorySummary from './CategorySummary';
import FullBar from './FullBar';

const CategoryTooltip = ({ category, children }) => {
  return (
    <Tooltip
      title={
        <List disablePadding>
          <ListItemText
            secondary={category.category}
            secondaryTypographyProps={{ align: 'center' }}
          />
          <ListItemText
            primary={numberToCurrency.format(category.expenseSum)}
            primaryTypographyProps={{ align: 'center', fontWeight: 'bold' }}
          />
        </List>
      }
    >
      {children}
    </Tooltip>
  );
};

export default function OverallSummary({
  budget,
  budgetCategories,
  setBudgetCategories,
  expenses,
  expenseSum,
  setShowSave,
}) {
  const [goalSum, setGoalSum] = useState(0);
  const [barMax, setBarMax] = useState(0);

  useEffect(() => {
    setBarMax(Math.max(expenseSum, goalSum, 100));
  }, [expenseSum, goalSum]);

  useEffect(() => {
    if (!budget) return;
    setGoalSum(
      budget?.categories?.reduce((acc, category) => acc + category.goal, 0)
    );
  }, [budget]);

  useEffect(() => {
    if (!budget || budget?.categories?.length === 0) return;
    let _budgetCategories = budget.categories.map((category) => {
      const categoryExpenses = expenses.filter(
        (expense) => expense.category === category.category
      );
      const categoryExpenseSum = categoryExpenses.reduce(
        (acc, expense) => acc + findAmount(expense),
        0
      );
      return {
        ...category,
        expenses: categoryExpenses,
        expenseSum: categoryExpenseSum,
      };
    });
    _budgetCategories.sort((a, b) => b.expenseSum - a.expenseSum);
    setBudgetCategories(_budgetCategories);
  }, [budget, barMax, expenses, setBudgetCategories]);

  const overallBudgetCategories = budgetCategories.filter(
    (category) => category.expenseSum > 0
  );
  const diff = goalSum - expenseSum;

  const updateGoal = (category, value) => {
    setShowSave(true);
    setBudgetCategories((prev) => {
      const newCategories = prev.map((c) =>
        c.category === category ? { ...c, goal: value } : c
      );
      return newCategories;
    });
  };

  return (
    <>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%', px: 2, py: 1 }}>
          <BoxFlexCenter justifyContent='space-between'>
            <Typography
              variant='body1'
              fontWeight='bold'
              color='text.secondary'
            >
              actual
            </Typography>
            <Typography variant='h5' fontWeight='bold' align='center'>
              overall
            </Typography>
            <Typography
              variant='body1'
              fontWeight='bold'
              color='text.secondary'
              align='right'
            >
              goal
            </Typography>
          </BoxFlexCenter>
          <BoxFlexCenter justifyContent='space-between'>
            <BoxFlexCenter justifyContent='flex-start'>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(expenseSum)}
              </Typography>
            </BoxFlexCenter>
            <Typography
              variant='body1'
              color={diff >= 0 ? 'success.main' : 'error.main'}
              fontWeight='bold'
            >
              {numberToCurrency.format(diff)}
            </Typography>
            <BoxFlexCenter justifyContent='flex-end'>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(goalSum)}
              </Typography>
            </BoxFlexCenter>
          </BoxFlexCenter>

          <FullBar>
            {overallBudgetCategories.map((category, idx) => {
              const borderRadius = (() => {
                if (idx === 0) return '4px 0 0 4px';
                if (idx === overallBudgetCategories.length - 1)
                  return '0 4px 4px 0';
                return '0 0 0 0';
              })();

              return (
                <CategoryTooltip key={category.category} category={category}>
                  <Box
                    sx={{
                      width: `${(category.expenseSum / barMax) * 100}%`,
                      height: '100%',
                      backgroundImage: (theme) =>
                        `linear-gradient(to bottom, ${category.color}, ${darken(
                          category.color,
                          0.4
                        )})`,
                      borderRadius,
                    }}
                  />
                </CategoryTooltip>
              );
            })}
          </FullBar>
        </Card>
      </Grid>
      {budgetCategories.map((category) => (
        <CategorySummary
          key={category.category}
          category={category}
          updateGoal={updateGoal}
          budget={budget}
        />
      ))}
    </>
  );
}
