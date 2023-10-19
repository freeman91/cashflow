import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get, map, sortBy } from 'lodash';
import { filter } from 'lodash';
import dayjs from 'dayjs';

import { Card, CardHeader, List, ListItem, ListItemText } from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';

function UpcomingBills() {
  const expenses = useSelector((state) => state.expenses.data);
  const [unpaidExpenses, setUnpaidExpenses] = useState([]);

  useEffect(() => {
    let yesterday = dayjs().subtract(1, 'day');
    let _expenses = filter(expenses, (expense) => {
      return (
        yesterday.isBefore(dayjs(get(expense, 'date')), 'day') &&
        !get(expense, 'paid', true)
      );
    });

    setUnpaidExpenses(sortBy(_expenses, 'date'));
  }, [expenses]);

  return (
    <Card raised>
      <CardHeader
        title={`Upcoming Bills`}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <List dense sx={{ pt: 0 }}>
        {map(unpaidExpenses, (expense) => {
          let _date = dayjs(expense.date);

          return (
            <ListItem key={expense.id}>
              <ListItemText
                sx={{ width: '25%' }}
                primary={_date.format('MMM DD')}
                primaryTypographyProps={{
                  align: 'left',
                }}
              />
              <ListItemText
                sx={{ width: '40%' }}
                primary={expense.vendor}
                primaryTypographyProps={{
                  align: 'left',
                }}
              />
              <ListItemText
                sx={{ width: '35%' }}
                primary={numberToCurrency.format(expense.amount)}
                primaryTypographyProps={{
                  align: 'right',
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}

export default UpcomingBills;
