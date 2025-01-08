import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import MenuItemContent from '../../../components/MenuItemContent';
import RepaymentsSummary from './RepaymentsSummary';
import ExpenseCategorySummary from './ExpenseCategorySummary';

export default function Spent(props) {
  const {
    year,
    month,
    numMonths = 1,
    groupedExpenses,
    repayments,
    principalSum,
    interestSum,
    escrowSum,
  } = props;
  const repaymentsSum = principalSum + interestSum + escrowSum;

  const [selected, setSelected] = useState({
    name: '',
    sum: 0,
    expenses: [],
  });

  useEffect(() => {
    if (repaymentsSum > 0) {
      setSelected({
        name: 'repayments',
        sum: repaymentsSum,
        expenses: repayments,
      });
    } else {
      console.log('find first expense category');
    }
  }, [repaymentsSum, repayments]);

  return (
    <>
      <Grid item xs={12} mx={1}>
        <Select
          fullWidth
          autoWidth
          value={selected.name}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: { bgcolor: 'surface.300' },
            },
            slotProps: {
              paper: {
                sx: { minWidth: '300px !important', maxWidth: '350px' },
              },
            },
          }}
          sx={{ '& .MuiSelect-select': { py: 0, px: 2 } }}
        >
          {repaymentsSum > 0 && (
            <MenuItem
              value='repayments'
              onClick={() =>
                setSelected({
                  name: 'repayments',
                  sum: repaymentsSum,
                  expenses: repayments,
                })
              }
            >
              <MenuItemContent
                subheader
                name='repayments'
                sum={repaymentsSum}
              />
            </MenuItem>
          )}
          <ListSubheader sx={{ bgcolor: 'surface.300' }}>
            <ListItemText
              primary='expense category'
              primaryTypographyProps={{ align: 'center', variant: 'h6' }}
            />
          </ListSubheader>
          {groupedExpenses.map((group) => {
            const { category, value, expenses, subcategories } = group;
            return (
              <MenuItem
                key={category}
                value={category}
                onClick={() => {
                  setSelected({
                    name: category,
                    sum: value,
                    expenses: expenses,
                    subcategories: subcategories,
                  });
                }}
              >
                <MenuItemContent name={category} sum={value} />
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      {selected.name === 'repayments' ? (
        <RepaymentsSummary
          year={year}
          month={month}
          numMonths={numMonths}
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          repayments={selected.expenses}
        />
      ) : (
        <ExpenseCategorySummary
          year={year}
          month={month}
          numMonths={numMonths}
          category={selected.name}
          sum={selected.sum}
          expenses={selected.expenses}
          subcategories={selected?.subcategories}
        />
      )}
    </>
  );
}
