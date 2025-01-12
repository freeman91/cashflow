import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import range from 'lodash/range';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DatePicker } from '@mui/x-date-pickers';

import { TRANSACTION_ORDER } from '../Transactions/Table';
import Day from '../Transactions/Day';
import { findAmount } from '../../helpers/transactions';
import { numberToCurrency } from '../../helpers/currency';

export default function RecurringCalendar() {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allRecurrings = useSelector((state) => state.recurrings.data);

  const [days, setDays] = useState([]);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(dayjs());
  const [expectedIncome, setExpectedIncome] = useState(0);
  const [expectedExpenses, setExpectedExpenses] = useState(0);

  useEffect(() => {
    let firstDayOfMonth = month.date(1).hour(12).minute(0).second(0);
    let firstDayOfWeek = firstDayOfMonth.day(0).hour(12).minute(0).second(0);

    let _days = [];
    let currentDay = firstDayOfWeek;

    while (currentDay.isBefore(firstDayOfMonth, 'month')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    while (currentDay.isSame(firstDayOfMonth, 'month')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    let lastDayOfMonth = currentDay.subtract(1, 'day');
    while (currentDay.isSame(lastDayOfMonth, 'week')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    setDays(_days);
  }, [month]);

  useEffect(() => {
    let _allTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
    ].filter((transaction) => {
      return transaction?.recurring_id?.length > 0;
    });
    let _data = days.map((day) => {
      let dayTransactions = _allTransactions.filter((transaction) => {
        return dayjs(transaction.date).isSame(day, 'day');
      });
      dayTransactions = dayTransactions.map((transaction) => ({
        ...transaction,
        _amount: findAmount(transaction),
      }));
      dayTransactions = dayTransactions.sort((a, b) => {
        return (
          TRANSACTION_ORDER.indexOf(a._type) -
            TRANSACTION_ORDER.indexOf(b._type) || b._amount - a._amount
        );
      });
      return {
        date: day,
        transactions: dayTransactions,
        recurrings: allRecurrings.filter((recurring) => {
          if (!recurring?.next_date) return false;
          return dayjs(recurring?.next_date).isSame(day, 'day');
        }),
      };
    });
    setData(_data);
  }, [allExpenses, allRepayments, allPaychecks, allIncomes, days]);

  useEffect(() => {
    let _expectedIncome = 0;
    let _expectedExpenses = 0;
    data.forEach((day) => {
      day.transactions.forEach((transaction) => {
        if (['paycheck', 'income'].includes(transaction._type)) {
          _expectedIncome += findAmount(transaction);
        } else if (['expense', 'repayment'].includes(transaction._type)) {
          _expectedExpenses += findAmount(transaction);
        }
      });
    });
    setExpectedIncome(_expectedIncome);
    setExpectedExpenses(_expectedExpenses);
  }, [data]);

  const numWeeks = Math.ceil(days.length / 7);
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'surface.250',
          borderRadius: 1,
          py: 1,
          boxShadow: (theme) => theme.shadows[4],
          width: '100%',
        }}
      >
        <Stack
          direction='row'
          sx={{ mx: 2 }}
          alignItems='center'
          justifyContent='space-between'
          divider={<Divider orientation='vertical' flexItem />}
        >
          <DatePicker
            openTo='month'
            views={['year', 'month']}
            value={month}
            onChange={(newValue) => setMonth(newValue)}
            slotProps={{
              textField: {
                variant: 'standard',
                inputProps: {
                  readOnly: true,
                },
                InputProps: { disableUnderline: true },
              },
              inputAdornment: {
                position: 'start',
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant='body2' color='textSecondary'>
              Expected Income
            </Typography>
            <Typography variant='body1'>
              {numberToCurrency.format(expectedIncome)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant='body2' color='textSecondary'>
              Recurring Expenses
            </Typography>
            <Typography variant='body1'>
              {numberToCurrency.format(expectedExpenses)}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Grid
        container
        columns={7}
        sx={{ backgroundColor: 'surface.250', borderRadius: 1, width: '100%' }}
      >
        {range(7).map((idx) => (
          <Grid
            key={`week-day-letter-${idx}`}
            size={{ xs: 1 }}
            py={0.5}
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography align='center' variant='body2'>
              {dayjs().day(idx).format('dddd')}
            </Typography>
          </Grid>
        ))}
        {data.map((day, idx) => {
          return (
            <Grid
              key={`day-${day.date.format('YYYY-MM-DD')}`}
              size={{ xs: 1 }}
              sx={{
                borderRight: (theme) =>
                  idx % 7 !== 6 ? `1px solid ${theme.palette.divider}` : '',
                borderBottom: (theme) =>
                  idx / 7 < numWeeks - 1
                    ? `1px solid ${theme.palette.divider}`
                    : '',
              }}
            >
              <Day
                month={month}
                date={day.date}
                recurrings={day.recurrings}
                transactions={day.transactions}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
