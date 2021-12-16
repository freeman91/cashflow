import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { get, filter, find, map, reduce } from 'lodash';
import {
  Box,
  TextField,
  Divider,
  Grid,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

import { getExpensesInRangeAPI } from '../../api';
import { numberToCurrency } from '../../helpers/currency';

const expenseTotal = (types, expenses) => {
  let filteredExpenses = filter(expenses, (expense) => {
    return types.includes(expense.type);
  });

  return reduce(
    filteredExpenses,
    (sum, expense) => {
      return sum + get(expense, 'amount', 0);
    },
    0
  );
};

const prepareMonthData = (year, month, goals, expenses) => {
  let monthData = find(goals, { year, month });
  let actual = 0;

  return map(get(monthData, 'values'), (value, category) => {
    if (category === 'Housing') {
      actual = expenseTotal(['Rent'], expenses);
    } else if (category === 'Utilities') {
      actual = expenseTotal(['Utility', 'Utilities'], expenses);
    } else if (category === 'Debt') {
      actual = expenseTotal(['Tuition'], expenses);
    } else if (category === 'Transportation') {
      actual = expenseTotal(['Car', 'Insurance', 'Bike'], expenses);
    } else if (category === 'Grocery') {
      actual = expenseTotal(['Grocery'], expenses);
    } else if (category === 'Dining') {
      actual = expenseTotal(['Food'], expenses);
    } else if (category === 'Health Care') {
      actual = expenseTotal(['Health'], expenses);
    } else if (category === 'Entertainment') {
      actual = expenseTotal(['Entertainment'], expenses);
    } else if (category === 'Pets') {
      actual = expenseTotal(['Dog'], expenses);
    } else if (category === 'Personal') {
      actual = expenseTotal([''], expenses);
    } else if (category === 'Home') {
      actual = expenseTotal(['Home'], expenses);
    } else if (category === 'Fitness') {
      actual = expenseTotal(['Fitness'], expenses);
    } else if (category === 'Investments') {
      actual = expenseTotal(['Asset'], expenses);
    } else {
      let prevTypes = [
        'Rent',
        'Utility',
        'Utilities',
        'Tuition',
        'Car',
        'Insurance',
        'Bike',
        'Grocery',
        'Food',
        'Health',
        'Entertainment',
        'Dog',
        'Home',
        'Fitness',
        'Asset',
      ];
      let otherExpenses = filter(expenses, (expense) => {
        return !prevTypes.includes(expense.type);
      });
      actual = reduce(
        otherExpenses,
        (sum, expense) => {
          return sum + get(expense, 'amount', 0);
        },
        0
      );
    }

    return {
      category,
      goal: value,
      actual: actual,
    };
  });
};

export default function GoalCharts() {
  const { data: goals } = useSelector((state) => state.goals);
  const [date, setDate] = useState(dayjs());
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchMonthExpenses() {
      let start = dayjs(`${date.year()}-${date.month() + 1}-01`);
      let stop = start.add(1, 'months');
      let expenses = await getExpensesInRangeAPI(start.unix(), stop.unix());
      setChartData(
        prepareMonthData(date.year(), date.month() + 1, goals, expenses)
      );
    }
    fetchMonthExpenses();
  }, [goals, date]);

  let totals = reduce(
    chartData,
    (acc, item) => {
      return {
        goal: acc.goal + get(item, 'goal'),
        actual: acc.actual + get(item, 'actual'),
      };
    },
    {
      goal: 0,
      actual: 0,
    }
  );

  let totalPercent = (totals.actual / totals.goal) * 100;

  return (
    <>
      <Grid item xs={12}>
        <DatePicker
          views={['year', 'month']}
          minDate={new Date('2021-11-01')}
          value={date}
          onChange={(newValue) => {
            setDate(dayjs(newValue));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={null}
              fullWidth
              variant='standard'
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <Typography align='left' variant='h4'>
            Total
          </Typography>
          <Tooltip
            sx={{ width: '10rem' }}
            title={
              <>
                <Grid
                  container
                  justifyContent='space-between'
                  key={`total-goal-grid`}
                  sx={{ width: '10rem' }}
                >
                  <Grid item xs={6}>
                    <Typography align='left'>Goal:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>
                      {numberToCurrency.format(totals.goal)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent='space-between'
                  key={`total-spent-grid`}
                  sx={{ width: '10rem' }}
                >
                  <Grid item xs={6}>
                    <Typography align='left'>Spent:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>
                      {numberToCurrency.format(totals.actual)}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            }
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant='determinate' value={totalPercent} />
              </Box>

              <Box sx={{ minWidth: 35 }}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                >{`${Math.round(totalPercent)}%`}</Typography>
              </Box>
            </Box>
          </Tooltip>

          <Divider sx={{ mt: '.5rem', mb: '.5rem' }} />

          {map(chartData, (item) => {
            let category = get(item, 'category');
            let actual = get(item, 'actual', 0);
            let goal = get(item, 'goal', 0);
            let percent = (actual / goal) * 100;

            return (
              <React.Fragment key={`${category}-fragment`}>
                <Typography align='left'>{category}</Typography>
                <Tooltip
                  title={
                    <>
                      <Typography align='center'>{category}</Typography>
                      <>
                        <Grid
                          container
                          justifyContent='space-between'
                          key={`${category}-goal-grid`}
                          sx={{ width: '10rem' }}
                        >
                          <Grid item xs={6}>
                            <Typography align='left'>Goal:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align='right'>
                              {numberToCurrency.format(goal)}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justifyContent='space-between'
                          key={`${category}-spent-grid`}
                          sx={{ width: '10rem' }}
                        >
                          <Grid item xs={6}>
                            <Typography align='left'>Spent:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align='right'>
                              {numberToCurrency.format(actual)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </>
                  }
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant='determinate' value={percent} />
                    </Box>

                    <Box sx={{ minWidth: 35 }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                      >{`${Math.round(percent)}%`}</Typography>
                    </Box>
                  </Box>
                </Tooltip>
              </React.Fragment>
            );
          })}
        </Box>
      </Grid>
    </>
  );
}
