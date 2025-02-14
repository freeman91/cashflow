import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';

import ListIcon from '@mui/icons-material/List';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { openItemView } from '../../store/itemView';
import { numberToCurrency } from '../../helpers/currency';
import { findAmount } from '../../helpers/transactions';
import ExpenseSubcategoryBreakdown from './ExpenseSubcategoryBreakdown';

export default function ExpenseCategoryBreakdown(props) {
  const { expenses, repayments } = props;
  const dispatch = useDispatch();

  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let _expenses = [...expenses, ...repayments];
    let _expensesByCategory = groupBy(_expenses, 'category');
    _expensesByCategory = Object.entries(_expensesByCategory).map(
      ([category, expenses]) => {
        return {
          category,
          expenses,
          sum: expenses.reduce((acc, expense) => acc + findAmount(expense), 0),
        };
      }
    );
    setExpensesByCategory(_expensesByCategory.sort((a, b) => b.sum - a.sum));
  }, [expenses, repayments]);

  return (
    <List disablePadding sx={{ width: '100%' }}>
      {expensesByCategory.map(({ category, sum, expenses }) => {
        if (selectedCategory === category || !selectedCategory) {
          return (
            <React.Fragment key={category}>
              <ListItem
                sx={{
                  cursor: 'pointer',
                  bgcolor:
                    selectedCategory === category
                      ? 'background.paper'
                      : 'unset',
                  backgroundImage: (theme) =>
                    selectedCategory === category
                      ? theme.vars.overlays[24]
                      : 'unset',
                  '&:hover': {
                    bgcolor: 'background.paper',
                    backgroundImage: (theme) => theme.vars.overlays[24],
                  },
                }}
                onClick={() => {
                  if (selectedCategory === category) {
                    setSelectedCategory(null);
                  } else {
                    setSelectedCategory(category);
                  }
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      openItemView({
                        itemType: 'transactions',
                        mode: 'view',
                        attrs: { label: category, transactions: expenses },
                      })
                    );
                  }}
                  sx={{ height: 30, width: 30, mr: 2 }}
                >
                  <ListIcon />
                </IconButton>
                <ListItemText primary={startCase(category)} />
                <ListItemText
                  primary={numberToCurrency.format(sum)}
                  slotProps={{ primary: { align: 'right' } }}
                />
              </ListItem>
              {selectedCategory === category && (
                <ExpenseSubcategoryBreakdown expenses={expenses} />
              )}
            </React.Fragment>
          );
        }
        return null;
      })}
    </List>
  );
}
