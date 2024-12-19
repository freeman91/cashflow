import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find'
import sumBy from 'lodash/sumBy';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import MenuItemContent from '../../components/MenuItemContent';
import ActualvBudget from './ActualvBudget';
import TransactionsByMonth from './TransactionsByMonth'

export default function ExpenseCategorySummary(props) {
  const {
    year,
    month,
    category,
    sum,
    expenses: categoryExpenses,
    subcategories = [],
  } = props;
  const dispatch = useDispatch();
  const expenseCategories = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const [selected, setSelected] = useState({
    name: '',
    sum: 0,
    expenses: [],
  });
  const [expenses, setExpenses] = useState(categoryExpenses);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);
  const [color, setColor] = useState('');

  useEffect(() => {
    const _category = find(expenseCategories.categories, {
      name: category,
    });
    setColor(_category?.color || '');
  }, [expenseCategories, category]);

  useEffect(() => {
    let _expenses = expenses;
    if (selected.name) {
      _expenses = selected.expenses;
    }
    setExpenses(_expenses);
  }, [expenses, selected]);

  useEffect(() => {
    const principalSum = sumBy(expenses, 'principal');
    const interestSum = sumBy(expenses, 'interest');
    const escrowSum = sumBy(expenses, 'escrow');
    setPrincipalSum(principalSum);
    setInterestSum(interestSum);
    setEscrowSum(escrowSum);
  }, [expenses]);

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  const showRepaymnetTotals =
    principalSum > 0 || interestSum > 0 || escrowSum > 0;
  return (
    <>
      <Grid item xs={12} mx={1}>
        <Select
          displayEmpty
          fullWidth
          value={selected.name}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: { bgcolor: 'surface.300' },
            },
          }}
          sx={{ '& .MuiSelect-select': { py: 1, px: 2 } }}
        >
          <MenuItem
            value=''
            onClick={() =>
              setSelected({
                name: '',
                sum: 0,
                expenses: [],
              })
            }
          >
            <Typography
              variant='h5'
              color='text.secondary'
              align='left'
              sx={{ width: '100%' }}
            >
              subcategories
            </Typography>
          </MenuItem>
          {subcategories.map((subcategory) => {
            const { name, value, expenses } = subcategory;
            return (
              <MenuItem
                key={name}
                value={name}
                onClick={() => {
                  setSelected({
                    name: name,
                    sum: value,
                    expenses: expenses,
                  });
                }}
              >
                <MenuItemContent name={name} sum={value} />
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      {showRepaymnetTotals && (
        <Grid item xs={12} mx={1}>
          <Card sx={{ width: '100%', p: 1 }}>
            {principalSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={principalSum} label='principal' />
              </Box>
            )}

            {interestSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={interestSum} label='interest' />
              </Box>
            )}
            {escrowSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={escrowSum} label='escrow' />
              </Box>
            )}
          </Card>
        </Grid>
      )}
      {!selected.name && (
        <ActualvBudget
          color={color}
          category={category}
          year={year}
          month={month}
          actual={sum}
        />
      )}

      {year && isNaN(month) && <TransactionsByMonth year={year} transactions={selected.name ? selected.expenses : categoryExpenses} color={color} />}

      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Button
          variant='outlined'
          color='primary'
          onClick={() =>
            openTransactionsDialog(
              selected.name ? `${category} - ${selected.name}` : category,
              selected.name ? selected.expenses : categoryExpenses
            )
          }
        >
          show all
        </Button>
      </Grid>
    </>
  );
}
