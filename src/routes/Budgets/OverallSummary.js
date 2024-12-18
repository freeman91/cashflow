import React, { useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';
import CategorySummary from './CategorySummary';

export default function OverallSummary({
  budget,
  budgetCategories,
  setBudgetCategories,
  setShowSave,
}) {
  useEffect(() => {
    if (!budget || budget?.categories?.length === 0) return;
    let _budgetCategories = cloneDeep(budget.categories);
    if (_budgetCategories) {
      _budgetCategories.sort((a, b) => b.goal - a.goal);
      setBudgetCategories(_budgetCategories);
    }
  }, [budget, setBudgetCategories]);

  const updateGoal = (category, value) => {
    setShowSave(true);
    setBudgetCategories((prev) => {
      const newCategories = prev.map((c) =>
        c.category === category ? { ...c, goal: value } : c
      );
      return newCategories;
    });
  };

  const totalGoal = budgetCategories.reduce((acc, category) => {
    return acc + Number(category.goal);
  }, 0);

  return (
    <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
      <Card sx={{ width: '100%', px: 2 }}>
        <List disablePadding>
          <ListItem disableGutters>
            <ListItemText
              secondary='total'
              secondaryTypographyProps={{
                align: 'left',
                fontWeight: 'bold',
                variant: 'body1',
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(totalGoal)}
              primaryTypographyProps={{ align: 'right', fontWeight: 'bold' }}
            />
          </ListItem>
          {budgetCategories.map((category) => (
            <CategorySummary
              key={category.category}
              category={category}
              updateGoal={updateGoal}
            />
          ))}
        </List>
      </Card>
    </Grid>
  );
}
