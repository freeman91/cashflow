import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { get, map, find, filter, reduce } from 'lodash';
import { makeStyles } from '@mui/styles';
import { Grid, Paper, Typography } from '@mui/material';

import { getGoals } from '../../store/goals';
import { getExpensesInRangeAPI } from '../../api';
import GoalsTable from '../../components/Table/GoalsTable';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: '1rem',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
    },
  };
});

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

export default function Budget() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data: goals } = useSelector((state) => state.goals);
  const [thisMonthData, setThisMonthData] = useState([]);

  useMount(() => {
    dispatch(getGoals());
  });

  useEffect(() => {
    async function fetchThisMonthData() {
      let now = dayjs();
      let start = dayjs(`${now.year()}-${now.month() + 1}-01`);
      let stop = start.add(1, 'months');
      let thisMonthExpenses = await getExpensesInRangeAPI(
        start.unix(),
        stop.unix()
      );
      let _thisMonthData = prepareMonthData(
        now.year(),
        now.month() + 1,
        goals,
        thisMonthExpenses
      );

      setThisMonthData(_thisMonthData);
    }
    fetchThisMonthData();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={6} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ width: '100%' }} align='center' variant='h4'>
                {dayjs().format('MMMM YYYY')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <GoalsTable items={thisMonthData} />
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={6} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ width: '100%' }} align='center' variant='h4'>
                {dayjs().add(1, 'month').format('MMMM YYYY')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '65vh' }} align='left' variant='h4'>
                List Goals and allow edit
                <br />
                Show Total at the end
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
