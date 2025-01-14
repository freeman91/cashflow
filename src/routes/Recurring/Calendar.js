import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import range from 'lodash/range';

import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';

import { findAmount } from '../../helpers/transactions';
import { TRANSACTION_ORDER } from '../Transactions/Table';
import Day from '../Transactions/Day';

export default function RecurringCalendar() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allRecurrings = useSelector((state) => state.recurrings.data);

  const [days, setDays] = useState([]);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(dayjs());

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
  }, [
    allExpenses,
    allRepayments,
    allPaychecks,
    allIncomes,
    allRecurrings,
    days,
  ]);

  const numWeeks = Math.ceil(days.length / 7);
  return (
    <Grid
      container
      columns={7}
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[8],
        boxShadow: (theme) => theme.shadows[4],
        borderRadius: 1,
      }}
    >
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          px: 2,
        }}
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
          <IconButton onClick={() => setMonth(month.subtract(1, 'month'))}>
            <ArrowBack />
          </IconButton>
          <IconButton onClick={() => setMonth(month.add(1, 'month'))}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Divider />
      </Grid>
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
            {dayjs()
              .day(idx)
              .format(isMobile ? 'ddd' : 'dddd')}
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
  );
}
