import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, get, groupBy, map, reduce, sortBy, uniq } from 'lodash';
import dayjs from 'dayjs';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { numberToCurrency } from '../../../helpers/currency';

export default function ExpenseView(props) {
  const { date1, date2 } = props;

  const allExpenses = useSelector((state) => state.expenses.data);

  const [d1Expenses, setD1Expenses] = useState([]);
  const [d2Expenses, setD2Expenses] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    let _expenses = filter(allExpenses, (expense) => {
      let _date = dayjs(get(expense, 'date'));
      return _date.year() === date1.year() && _date.month() === date1.month();
    });

    setD1Expenses(groupBy(_expenses, 'type'));
  }, [date1, allExpenses]);

  useEffect(() => {
    let _expenses = filter(allExpenses, (expense) => {
      let _date = dayjs(get(expense, 'date'));
      return _date.year() === date2.year() && _date.month() === date2.month();
    });

    setD2Expenses(groupBy(_expenses, 'type'));
  }, [date2, allExpenses]);

  useEffect(() => {
    setTypes(
      uniq([...Object.keys(d1Expenses), ...Object.keys(d2Expenses)]).sort()
    );
  }, [d1Expenses, d2Expenses]);

  const handleSelectView = (type) => {
    setSelectedType(type);
  };

  const d1SelectedTypeSum = reduce(
    d1Expenses[selectedType],
    (sum, expense) => {
      return sum + get(expense, 'amount', 0);
    },
    0
  );
  const d2SelectedTypeSum = reduce(
    d2Expenses[selectedType],
    (sum, expense) => {
      return sum + get(expense, 'amount', 0);
    },
    0
  );

  return (
    <Card raised>
      <CardContent sx={{ paddingBottom: '8px !important' }}>
        <Grid container spacing={1}>
          {selectedType ? (
            <React.Fragment>
              <Grid item xs={4}>
                <Typography align='left' variant='h6'>
                  {numberToCurrency.format(d1SelectedTypeSum)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant='text'
                  color='info'
                  sx={{ p: 0, mb: 1 }}
                  onClick={() => setSelectedType(null)}
                >
                  <Typography align='center' variant='h5' color='grey.400'>
                    {selectedType}
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Typography align='right' variant='h6'>
                  {numberToCurrency.format(d2SelectedTypeSum)}
                </Typography>
              </Grid>
              <Grid item xs={6} pr={2} sx={{ borderRight: '1px solid grey' }}>
                {map(sortBy(d1Expenses[selectedType], 'date'), (expense) => (
                  <div
                    key={expense.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      align='left'
                      variant='body1'
                      sx={{ minWidth: 50 }}
                    >
                      {dayjs(expense.date).format('Do')}
                    </Typography>
                    <Typography align='center' variant='body1'>
                      {expense.vendor}
                    </Typography>
                    <Typography align='right' variant='body1'>
                      {numberToCurrency.format(expense.amount)}
                    </Typography>
                  </div>
                ))}
              </Grid>
              <Grid item xs={6} pl={2} sx={{ borderLeft: '1px solid grey' }}>
                {map(sortBy(d2Expenses[selectedType], 'date'), (expense) => (
                  <div
                    key={expense.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography align='right' variant='body1'>
                      {numberToCurrency.format(expense.amount)}
                    </Typography>
                    <Typography align='center' variant='body1'>
                      {expense.vendor}
                    </Typography>
                    <Typography align='left' variant='body1'>
                      {dayjs(expense.date).format('Do')}
                    </Typography>
                  </div>
                ))}
              </Grid>
            </React.Fragment>
          ) : (
            map(types, (type) => {
              const d1Sum = reduce(
                get(d1Expenses, type),
                (sum, expense) => sum + get(expense, 'amount'),
                0
              );
              const d2Sum = reduce(
                get(d2Expenses, type),
                (sum, expense) => sum + get(expense, 'amount'),
                0
              );

              return (
                <React.Fragment key={type}>
                  <Grid item xs={4}>
                    <Typography align='left' variant='h6'>
                      {d1Sum === 0 ? ' -' : numberToCurrency.format(d1Sum)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant='text'
                      color='info'
                      sx={{ p: 0 }}
                      onClick={() => handleSelectView(type)}
                    >
                      <Typography align='center' variant='h6' color='grey.400'>
                        {type}
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography align='right' variant='h6'>
                      {d2Sum === 0 ? '-' : numberToCurrency.format(d2Sum)}
                    </Typography>
                  </Grid>
                </React.Fragment>
              );
            })
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
