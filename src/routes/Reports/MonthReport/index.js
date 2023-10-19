import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, get, groupBy, map, reduce, sortBy } from 'lodash';
import dayjs from 'dayjs';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { MonthYearSelector } from '../../../components/Selector';
import { numberToCurrency } from '../../../helpers/currency';

export default function MonthReport(props) {
  const { date, setDate } = props;
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const allExpenses = useSelector((state) => state.expenses.data);
  const allIncomes = useSelector((state) => state.incomes.data);

  useEffect(() => {
    let _incomes = filter(allIncomes, (income) => {
      let _date = dayjs(get(income, 'date'));
      return _date.year() === date.year() && _date.month() === date.month();
    });

    _incomes = map(groupBy(_incomes, 'type'), (incomes, _type) => {
      return {
        type: _type,
        incomes,
        sum: reduce(
          incomes,
          (acc, income) => {
            return acc + get(income, 'amount', 0);
          },
          0
        ),
      };
    });

    setIncomes(sortBy(_incomes, 'sum').reverse());
  }, [allIncomes, date]);

  useEffect(() => {
    let _expenses = filter(allExpenses, (expense) => {
      let _date = dayjs(get(expense, 'date'));
      return (
        _date.year() === date.year() &&
        _date.month() === date.month() &&
        expense.paid
      );
    });

    _expenses = map(groupBy(_expenses, 'type'), (expenses, _type) => {
      return {
        type: _type,
        expenses,
        sum: reduce(
          expenses,
          (acc, expense) => {
            return acc + get(expense, 'amount', 0);
          },
          0
        ),
      };
    });

    setExpenses(sortBy(_expenses, 'sum').reverse());
  }, [allExpenses, date]);

  const handleDateChange = (selectedDate) => {
    setDate(dayjs(selectedDate));
  };

  const handleBackClick = () => {
    setDate(date.subtract(1, 'month'));
  };

  const handleForwardClick = () => {
    setDate(date.add(1, 'month'));
  };

  const expTotal = reduce(
    expenses,
    (acc, expense) => acc + get(expense, 'sum', 0),
    0
  );
  const incTotal = reduce(
    incomes,
    (acc, income) => acc + get(income, 'sum', 0),
    0
  );

  return (
    <Grid
      container
      item
      xs={6}
      spacing={2}
      height={'100%'}
      alignItems='flex-start'
    >
      <Grid item xs={12}>
        <Card raised>
          <CardContent
            sx={{
              paddingBottom: '8px !important',
              pt: 1,
            }}
          >
            <div>
              <IconButton onClick={handleBackClick} size='small'>
                <ArrowBackIosNewIcon />
              </IconButton>
              <MonthYearSelector
                date={date}
                handleDateChange={handleDateChange}
                interval={'month'}
              />
              <IconButton onClick={handleForwardClick} size='small'>
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography align='left' variant='h6'>
                Income
              </Typography>
              <Typography align='right' variant='h6'>
                {numberToCurrency.format(incTotal)}
              </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography align='left' variant='h6'>
                Expenses
              </Typography>
              <Typography align='right' variant='h6'>
                {numberToCurrency.format(expTotal)}
              </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography align='left' variant='h6'>
                Net
              </Typography>
              <Typography align='right' variant='h6'>
                {numberToCurrency.format(incTotal - expTotal)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
