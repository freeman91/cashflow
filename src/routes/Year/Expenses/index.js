import React, { useEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../helpers/currency';
import useExpenses from '../../../store/hooks/useExpenses';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import ExpensesByMonthChart from './ExpensesByMonthChart';
import ExpenseTotals from '../../../components/summary/ExpenseTotals';
import { useTheme } from '@emotion/react';
import { findAmount } from '../../../helpers/transactions';

export default function YearExpenses(props) {
  const { year } = props;
  const theme = useTheme();
  const { expenses, sum: expenseSum } = useExpenses(year);
  const [groupedExpenses, setGroupedExpenses] = useState([]);

  useEffect(() => {
    let _groupedExpenses = groupBy(expenses, 'category');
    _groupedExpenses = Object.keys(_groupedExpenses).map((key) => {
      const color = theme.chartColors[key] || theme.palette.red[600];

      const groupExpenses = _groupedExpenses[key];
      let groupedBySubcategory = groupBy(groupExpenses, 'subcategory');
      groupedBySubcategory = Object.keys(groupedBySubcategory).map((key) => {
        const subcategoryExpenses = groupedBySubcategory[key];
        return {
          name: key,
          value: reduce(
            subcategoryExpenses,
            (sum, item) => sum + findAmount(item),
            0
          ),
        };
      });
      groupedBySubcategory.sort((a, b) => b.value - a.value);

      return {
        id: key,
        name: key,
        category: key,
        color,
        value: reduce(groupExpenses, (sum, item) => sum + findAmount(item), 0),
        subcategories: groupedBySubcategory,
      };
    });
    _groupedExpenses.sort((a, b) => b.value - a.value);
    setGroupedExpenses(_groupedExpenses);
  }, [expenses, theme]);

  return (
    <>
      <Grid item xs={12} mx={1} pt='0 !important'>
        <BoxFlexCenter>
          <Typography variant='h4' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h4' color='white' fontWeight='bold'>
            {_numberToCurrency.format(expenseSum)}
          </Typography>
        </BoxFlexCenter>
      </Grid>
      <ExpensesByMonthChart year={year} />
      <ExpenseTotals expenses={expenses} groupedExpenses={groupedExpenses} />
    </>
  );
}
