import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { numberToCurrency } from '../../helpers/currency';
import { getExpenses } from '../../store/expenses';
import { getIncomes } from '../../store/incomes';
import { getPaychecks } from '../../store/paychecks';

export default function Cashflow({ month, setMonth }) {
  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  // const [budget] = useState(3800);
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
      return (
        date.year() === month.year() &&
        date.month() === month.month() &&
        !expense.pending
      );
    });

    let repayments = filter(allRepayments, (repayment) => {
      const date = dayjs(repayment.date);
      return (
        date.year() === month.year() &&
        date.month() === month.month() &&
        !repayment.pending
      );
    });

    total += reduce(expenses, (sum, expense) => sum + expense.amount, 0);
    total += reduce(
      repayments,
      (sum, repayment) =>
        sum +
        repayment.principal +
        repayment.interest +
        (repayment.escrow ? repayment.escrow : 0),
      0
    );

    setMonthExpenseSum(total);
  }, [month, allExpenses, allRepayments]);

  const handleDateSelect = (e) => {
    setMonth(e);

    const start = e.startOf('month');
    const end = e.endOf('month');
    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
  };

  return (
    <Card raised>
      <CardContent sx={{ pt: 1, pb: '4px !important' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <IconButton
            sx={{ height: 30, width: 30 }}
            onClick={() => {
              let date = month.date(15).subtract(1, 'month');
              handleDateSelect(date);
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <DatePicker
            views={['year', 'month']}
            maxDate={dayjs().add(1, 'month').toDate()}
            minDate={dayjs('2018-01-01').toDate()}
            value={month}
            onChange={handleDateSelect}
            renderInput={(params) => {
              return (
                <TextField
                  variant='standard'
                  margin='dense'
                  sx={{ m: '0 !important' }}
                  {...params}
                />
              );
            }}
          />
          <IconButton
            sx={{ height: 30, width: 30 }}
            onClick={() => {
              let date = month.date(15).add(1, 'month');
              handleDateSelect(date);
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>

        <Divider sx={{ mt: 1, mb: 1 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            ml: 2,
            mr: 2,
          }}
        >
          <Typography variant='h6'>income</Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(monthIncomeSum)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            ml: 2,
            mr: 2,
          }}
        >
          <Typography variant='h6'>expenses</Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(monthExpenseSum)}
          </Typography>
        </Box>
        <Divider sx={{ mt: 1, mb: 1 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            ml: 2,
            mr: 2,
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 800 }}>
            net
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 800 }}>
            {numberToCurrency.format(monthIncomeSum - monthExpenseSum)}
          </Typography>
        </Box>

        {/* <Divider sx={{ mt: 2, mb: 2 }} /> */}
        {/* <Tooltip
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
        </div> */}
      </CardContent>
    </Card>
  );
}
