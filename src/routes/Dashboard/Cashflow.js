import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';

export default function Cashflow({ month }) {
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allExpenses = useSelector((state) => state.expenses.data);

  const [budget] = useState(3800);
  const [monthIncomeSum, setMonthIncomeSum] = useState(0);
  const [monthExpenseSum, setMonthExpenseSum] = useState([]);

  useEffect(() => {
    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      const date = dayjs(income.date);
      return date.year() === month.year() && date.month() === month.month();
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      const date = dayjs(paycheck.date);
      return date.year() === month.year() && date.month() === month.month();
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setMonthIncomeSum(total);
  }, [month, allIncomes, allPaychecks]);

  useEffect(() => {
    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      const date = dayjs(expense.date);
      return date.year() === month.year() && date.month() === month.month();
    });

    total += reduce(expenses, (sum, expense) => sum + expense.amount, 0);

    setMonthExpenseSum(total);
  }, [month, allExpenses]);

  return (
    <Card raised>
      <CardContent sx={{ pt: 1, pb: '4px !important' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 800 }}>{`${month
            .format('MMMM')
            .toLowerCase()} cashflow`}</Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(monthIncomeSum - monthExpenseSum)}
          </Typography>
        </div>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          <Typography variant='h6'>income</Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(monthIncomeSum)}
          </Typography>
        </div>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <Tooltip
          title={
            <List disablePadding sx={{ width: '10rem' }}>
              <ListItem
                disablePadding
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <ListItemText
                  primary='spent'
                  secondary={numberToCurrency.format(monthExpenseSum)}
                />
                <ListItemText
                  primary='budget'
                  secondary={numberToCurrency.format(budget)}
                />
              </ListItem>
            </List>
          }
          placement='top'
        >
          <Stack>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                marginLeft: 16,
                marginRight: 16,
              }}
            >
              <Typography variant='h6'>spent</Typography>
              <Typography variant='h6'>vs</Typography>
              <Typography variant='h6'>budget</Typography>
            </div>

            <LinearProgress
              variant='determinate'
              value={(monthExpenseSum / budget) * 100}
            />
          </Stack>
        </Tooltip>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          <Typography variant='h6'>
            {numberToCurrency.format(monthExpenseSum)}
          </Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(budget)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
