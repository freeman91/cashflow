import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';

import ListIcon from '@mui/icons-material/List';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { openItemView } from '../../../store/itemView';
import { numberToCurrency } from '../../../helpers/currency';
import { findAmount } from '../../../helpers/transactions';

export default function ExpenseSubcategoryBreakdown(props) {
  const { expenses } = props;
  const dispatch = useDispatch();
  const [expensesBySubcategory, setExpensesByCategory] = useState([]);

  useEffect(() => {
    let _expensesBySubcategory = groupBy(expenses, 'subcategory');
    _expensesBySubcategory = Object.entries(_expensesBySubcategory).map(
      ([subcategory, categoryExpenses]) => ({
        subcategory,
        categoryExpenses,
        sum: categoryExpenses.reduce(
          (acc, expense) => acc + findAmount(expense),
          0
        ),
      })
    );
    setExpensesByCategory(_expensesBySubcategory.sort((a, b) => b.sum - a.sum));
  }, [expenses]);

  return (
    <>
      {expensesBySubcategory.map(({ subcategory, sum, categoryExpenses }) => (
        <ListItem key={subcategory} sx={{ px: 4 }}>
          <IconButton
            onClick={() =>
              dispatch(
                openItemView({
                  itemType: 'transactions',
                  mode: 'view',
                  attrs: {
                    label: startCase(subcategory),
                    transactions: categoryExpenses,
                  },
                })
              )
            }
            sx={{ height: 30, width: 30, mr: 2 }}
          >
            <ListIcon />
          </IconButton>
          <ListItemText primary={startCase(subcategory)} />
          <ListItemText
            primary={numberToCurrency.format(sum)}
            slotProps={{ primary: { align: 'right' } }}
          />
        </ListItem>
      ))}
    </>
  );
}
