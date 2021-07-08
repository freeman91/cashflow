import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/styles';
import { Chip, Grid, Paper, Typography } from '@material-ui/core';
import { filter, forEach } from 'lodash';

import Table from '../../components/Table';
import { getRecentExpenses } from '../../store/expenses';
import { getRecentIncomes } from '../../store/incomes';
import { getRecentHours } from '../../store/hours';
import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import { getNetworths } from '../../store/networths';

import GenerateRecordButton from '../../components/GenerateRecord';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: '1rem',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
    },
    button: {
      marginLeft: 'auto',
    },
  };
});

export default function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const { data: expenses } = useSelector((state) => state.expenses);
  const { data: incomes } = useSelector((state) => state.incomes);
  const { data: hours } = useSelector((state) => state.hours);
  const [filterExpense, setFilterExpense] = useState(false);
  const [filterIncome, setFilterIncome] = useState(false);
  const [filterHour, setFilterHour] = useState(false);
  // const { data: goals } = useSelector((state) => state.goals);
  // const { data: networths } = useSelector((state) => state.networths);
  // const { data: assets } = useSelector((state) => state.assets);
  // const { data: debts } = useSelector((state) => state.debts);

  useEffect(() => {
    dispatch(getRecentExpenses());
    dispatch(getRecentIncomes());
    dispatch(getRecentHours());
    dispatch(getAssets());
    dispatch(getDebts());
    dispatch(getNetworths());
  }, [dispatch]);

  useEffect(() => {
    const prepareRecentRecords = () => {
      var _expenses = filterExpense ? [] : expenses;
      var _incomes = filterIncome ? [] : incomes;
      var _hours = filterHour ? [] : hours;

      let records = [];
      let days = [];
      for (var i = 0; i <= 7; i++) {
        days.push(dayjs().subtract(i, 'day').format('MM-DD-YYYY'));
      }

      forEach(days, (day) => {
        let dayRecords = [];
        let dayExpenses = filter(_expenses, (expense) => {
          return expense.date === day;
        });
        let dayIncomes = filter(_incomes, (income) => {
          return income.date === day;
        });
        let dayHours = filter(_hours, (hour) => {
          return hour.date === day;
        });
        dayRecords = dayRecords
          .concat(dayExpenses)
          .concat(dayIncomes)
          .concat(dayHours);
        dayRecords = dayRecords.map((record, i) => {
          if (i === 0) return { ...record, displayDate: day };
          return record;
        });
        records = records.concat(dayRecords);
      });
      return records.slice(0, 15);
    };
    setTableData(prepareRecentRecords(expenses, incomes, hours));
    //eslint-disable-next-line
  }, [expenses, incomes, hours, filterExpense, filterIncome, filterHour]);

  const handleChipClick = (category) => {
    switch (category) {
      case 'income':
        setFilterIncome(!filterIncome);
        break;
      case 'hour':
        setFilterHour(!filterHour);
        break;
      default:
        setFilterExpense(!filterExpense);
        break;
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography align='right' variant='h4'>
                {dayjs().format('dddd, MMMM D YYYY')}
              </Typography>
              <div className={classes.button}>
                <GenerateRecordButton />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '65vh' }} align='left' variant='h4'>
                Crypto Prices
                <br />
                Current Net Worth
                <br />
                Links to Robinhood/BlockFi
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '35vh' }} align='center' variant='h4'>
                YTD Percent Income
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '35vh' }} align='center' variant='h4'>
                YTD Expenses by type
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <div style={{ width: '100%', marginBottom: '2ch' }}>
            <Chip
              sx={{ margin: '0 .5rem 0 .5rem' }}
              label='Expense'
              color={filterExpense ? 'default' : 'primary'}
              onClick={() => handleChipClick('expense')}
            />
            <Chip
              sx={{ margin: '0 .5rem 0 .5rem' }}
              label='Income'
              color={filterIncome ? 'default' : 'primary'}
              onClick={() => handleChipClick('income')}
            />
            <Chip
              sx={{ margin: '0 .5rem 0 .5rem' }}
              label='Hour'
              color={filterHour ? 'default' : 'primary'}
              onClick={() => handleChipClick('hour')}
            />
          </div>
          <Table
            data={tableData}
            title='Recent Records'
            handleClick={(record) => console.log('record: ', record)}
            attrs={['date', 'category', 'amount', 'source']}
            pagniate
            rowsPerPage={15}
          />
        </Grid>
      </Grid>
    </>
  );
}
