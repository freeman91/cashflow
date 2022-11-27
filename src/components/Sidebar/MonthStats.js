import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, get, reduce } from 'lodash';
import dayjs from 'dayjs';

import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';

function MonthStats() {
  const today = dayjs();
  const monthName = today.format('MMMM');

  const expenses = useSelector((state) => state.expenses.data);
  const incomes = useSelector((state) => state.incomes.data);

  const [stats, setStats] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    const monthExpenses = filter(expenses, (expense) => {
      return (
        today.isSame(dayjs(get(expense, 'date')), 'month') &&
        get(expense, 'paid', true)
      );
    });
    const monthIncomes = filter(incomes, (income) => {
      return today.isSame(dayjs(get(income, 'date')), 'month');
    });

    setStats({
      income: reduce(
        monthIncomes,
        (acc, income) => acc + get(income, 'amount', 0),
        0
      ),
      expense: reduce(
        monthExpenses,
        (acc, expense) => acc + get(expense, 'amount', 0),
        0
      ),
    });

    /* eslint-disable-next-line */
  }, [expenses, incomes]);

  return (
    <Card>
      <CardHeader
        title={`${monthName} Balance`}
        sx={{ pb: 0 }}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <List dense sx={{ pt: 0 }}>
        <ListItem>
          <ListItemText
            primary={numberToCurrency.format(stats.income - stats.expense)}
            primaryTypographyProps={{
              variant: 'h6',
              align: 'center',
              fontWeight: 700,
            }}
          />
        </ListItem>
        <Divider variant='middle' />
        <ListItem>
          <ListItemText
            primary='Incomes'
            primaryTypographyProps={{
              align: 'left',
            }}
          />
          <ListItemText
            primary={numberToCurrency.format(stats.income)}
            primaryTypographyProps={{
              align: 'right',
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary='Expenses'
            primaryTypographyProps={{
              align: 'left',
            }}
          />
          <ListItemText
            primary={numberToCurrency.format(stats.expense)}
            primaryTypographyProps={{
              align: 'right',
            }}
          />
        </ListItem>
      </List>
    </Card>
  );
}

export default MonthStats;
