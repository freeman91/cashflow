import React, { useState } from 'react';
import { useMount } from 'react-use';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { filter, reduce } from 'lodash';

import { makeStyles } from '@material-ui/styles';
import DateRangePicker from '@material-ui/lab/DateRangePicker';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Grid,
  Paper,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

import {
  getExpensesInRangeAPI,
  getIncomesInRangeAPI,
  getHoursInRangeAPI,
} from '../../api';
import Table from '../../components/Table';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: '1rem',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  };
});

const defaultRange = [
  dayjs().date(1).hour(0),
  dayjs().add(1, 'month').date(0).hour(23),
];

export default function Summary() {
  const classes = useStyles();
  const [tableData, setTableData] = useState([]);
  const [filterExpense, setFilterExpense] = useState(false);
  const [filterIncome, setFilterIncome] = useState(false);
  const [filterHour, setFilterHour] = useState(false);
  const [expenseType, setExpenseType] = useState('all');
  const [expenseVendor, setExpenseVendor] = useState('all');
  const [incomeType, setIncomeType] = useState('all');
  const [incomeSource, setIncomeSource] = useState('all');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [hours, setHours] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, hour: 0 });
  const [prevRange, setPrevRange] = useState(defaultRange);
  const [range, setRange] = useState(defaultRange);
  const user = useSelector((state) => state.user);

  const prepareData = (_expenses, _incomes, _hours) => {
    var _expenses_ = filterExpense ? [] : _expenses;
    var _incomes_ = filterIncome ? [] : _incomes;
    var _hours_ = filterHour ? [] : _hours;

    let records = [];
    var _day = range[0];
    while (_day <= range[1]) {
      let dayRecords = [];
      const dayStr = _day.format('MM-DD-YYYY');
      let dayExpenses = filter(_expenses_, (expense) => {
        if (expenseType !== 'all' && expenseType !== expense.type) return false;
        if (expenseVendor !== 'all' && expenseVendor !== expense.vendor)
          return false;
        return expense.date === dayStr;
      });
      let dayIncomes = filter(_incomes_, (income) => {
        if (incomeType !== 'all' && incomeType !== income.type) return false;
        if (incomeSource !== 'all' && incomeSource !== income.source)
          return false;
        return income.date === dayStr;
      });
      let dayHours = filter(_hours_, (hour) => {
        if (incomeSource !== 'all' && incomeSource !== hour.source)
          return false;
        return hour.date === dayStr;
      });
      dayRecords = dayRecords
        .concat(dayExpenses)
        .concat(dayIncomes)
        .concat(dayHours);
      dayRecords = dayRecords.map((record, i) => {
        if (i === 0) return { ...record, displayDate: dayStr };
        return record;
      });
      records = records.concat(dayRecords);
      _day = _day.add(1, 'day');
    }
    setTableData(records);
    setStats({
      expense: reduce(
        _expenses_,
        (sum, expense) => {
          return sum + expense.amount;
        },
        0
      ),
      income: reduce(
        _incomes_,
        (sum, income) => {
          return sum + income.amount;
        },
        0
      ),
      hour: reduce(
        _hours_,
        (sum, hour) => {
          return sum + hour.amount;
        },
        0
      ),
    });
  };

  const getRecords = async () => {
    const start = range[0].unix();
    const end = range[1].unix();
    Promise.all([
      getExpensesInRangeAPI(start, end),
      getIncomesInRangeAPI(start, end),
      getHoursInRangeAPI(start, end),
    ]).then(([_expenses, _incomes, _hours]) => {
      setExpenses(_expenses);
      setIncomes(_incomes);
      setHours(_hours);
      prepareData(_expenses, _incomes, _hours);
    });
  };

  const handleSearchClick = () => {
    if (prevRange === range) prepareData(expenses, incomes, hours);
    else {
      setPrevRange(range);
      getRecords();
    }
  };

  // TODO: generate Totals chart

  useMount(() => {
    getRecords();
  });

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <DateRangePicker
                    startText='start'
                    endText='end'
                    value={range}
                    onChange={(val) => {
                      setRange([dayjs(val[0]).hour(0), dayjs(val[1]).hour(23)]);
                    }}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    sx={{ marginLeft: 'auto', marginRight: '1rem' }}
                    aria-label='submit'
                    color='primary'
                    onClick={handleSearchClick}
                    component='span'
                    variant='contained'
                  >
                    <SearchIcon sx={{ transform: 'scale(1.8)' }} />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ width: '100%' }} align='center'>
                      Filters
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ width: '100%', marginBottom: '2ch' }}>
                      <Chip
                        sx={{ margin: '0 .5rem 0 .5rem' }}
                        label='Expense'
                        color={filterExpense ? 'default' : 'primary'}
                        onClick={() => setFilterExpense(!filterExpense)}
                      />
                      <Chip
                        sx={{ margin: '0 .5rem 0 .5rem' }}
                        label='Income'
                        color={filterIncome ? 'default' : 'primary'}
                        onClick={() => setFilterIncome(!filterIncome)}
                      />
                      <Chip
                        sx={{ margin: '0 .5rem 0 .5rem' }}
                        label='Hour'
                        color={filterHour ? 'default' : 'primary'}
                        onClick={() => setFilterHour(!filterHour)}
                      />
                    </div>
                    <FormControl margin='dense' sx={{ m: 1, width: '45%' }}>
                      <InputLabel id='expense-type-select-label'>
                        expense type
                      </InputLabel>
                      <Select
                        disabled={filterExpense}
                        labelId='expense-type-select-label'
                        id='expense-type-select'
                        value={expenseType}
                        label='expense type'
                        onChange={(e) => setExpenseType(e.target.value)}
                      >
                        <MenuItem value={'all'}>all</MenuItem>
                        {user.expense.types.map((type, i) => {
                          return (
                            <MenuItem key={i} value={type}>
                              {type}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl margin='dense' sx={{ m: 1, width: '45%' }}>
                      <InputLabel id='income-type-select-label'>
                        income type
                      </InputLabel>
                      <Select
                        disabled={filterIncome && filterHour}
                        labelId='income-type-select-label'
                        id='income-type-select'
                        value={incomeType}
                        label='income type'
                        onChange={(e) => setIncomeType(e.target.value)}
                      >
                        <MenuItem value={'all'}>all</MenuItem>
                        {user.income.types.map((type, i) => {
                          return (
                            <MenuItem key={i} value={type}>
                              {type}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl margin='dense' sx={{ m: 1, width: '45%' }}>
                      <InputLabel id='expense-vendor-select-label'>
                        expense vendor
                      </InputLabel>
                      <Select
                        disabled={filterExpense}
                        labelId='expense-vendor-select-label'
                        id='expense-vendor-select'
                        value={expenseVendor}
                        label='expense vendor'
                        onChange={(e) => setExpenseVendor(e.target.value)}
                      >
                        <MenuItem value={'all'}>all</MenuItem>
                        {user.expense.vendors.map((vendor, i) => {
                          return (
                            <MenuItem key={i} value={vendor}>
                              {vendor}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl margin='dense' sx={{ m: 1, width: '45%' }}>
                      <InputLabel id='income-source-select-label'>
                        income source
                      </InputLabel>
                      <Select
                        disabled={filterIncome && filterHour}
                        labelId='income-source-select-label'
                        id='income-source-select'
                        value={incomeSource}
                        label='income source'
                        onChange={(e) => setIncomeSource(e.target.value)}
                      >
                        <MenuItem value={'all'}>all</MenuItem>
                        {user.income.sources.map((source, i) => {
                          return (
                            <MenuItem key={i} value={source}>
                              {source}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Table
              data={[
                { name: 'net', amount: stats.income - stats.expense },
                { name: 'expense total', amount: stats.expense },
                { name: 'income total', amount: stats.income },
                { name: 'hour total', amount: stats.hour, category: 'hour' },
              ]}
              title='Totals'
              handleClick={() => {}}
              attrs={['name', 'amount']}
            />
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Table
              data={tableData}
              title='Records'
              handleClick={(row) => console.log('row: ', row)}
              attrs={['date', 'category', 'amount', 'source']}
              paginate
              size='small'
            />
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '15vh' }} align='left' variant='h4'>
                Chart 1
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '15vh' }} align='left' variant='h4'>
                Chart 2
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
