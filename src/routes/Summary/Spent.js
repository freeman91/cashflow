import React, { useEffect, useState } from 'react';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuItemContent from '../../components/MenuItemContent';
import RepaymentsSummary from './RepaymentsSummary';
import ExpenseCategorySummary from './ExpenseCategorySummary';

export default function Spent(props) {
  const {
    year,
    month,
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
          value={selected.name}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: { bgcolor: 'surface.300' },
            },
          }}
          sx={{ '& .MuiSelect-select': { py: 1, px: 2 } }}
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
          {repaymentsSum > 0 && <Divider sx={{ my: '0 !important', mx: 1 }} />}
          <ListSubheader sx={{ bgcolor: 'unset', py: 0.5 }}>
            <Typography
              variant='h5'
              color='text.secondary'
              align='center'
              fontWeight='bold'
            >
              expenses by category
            </Typography>
          </ListSubheader>
          {repaymentsSum > 0 && <Divider sx={{ my: '0 !important', mx: 1 }} />}
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
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          repayments={selected.expenses}
        />
      ) : (
        <ExpenseCategorySummary
          year={year}
          month={month}
          category={selected.name}
          sum={selected.sum}
          expenses={selected.expenses}
          subcategories={selected?.subcategories}
        />
      )}
    </>
  );
}
