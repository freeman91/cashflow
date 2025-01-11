import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import range from 'lodash/range';

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import { TRANSACTION_ORDER } from './Table';
import Day from './Day';

export default function DesktopTransactionsCalendar(props) {
  const { month, types } = props;

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allBorrows = useSelector((state) => state.borrows.data);

  const [days, setDays] = useState([]);
  const [data, setData] = useState([]);

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
      ...allPurchases,
      ...allSales,
      ...allBorrows,
    ].filter((transaction) => {
      if (types.length > 0 && !types.includes(transaction._type)) return false;
      return true;
    });
    let _data = days.map((day) => {
      let dayTransactions = _allTransactions.filter((transaction) => {
        return dayjs(transaction.date).isSame(day, 'day');
      });
      dayTransactions = dayTransactions.sort((a, b) => {
        return (
          TRANSACTION_ORDER.indexOf(a._type) -
            TRANSACTION_ORDER.indexOf(b._type) || a._amount - b._amount
        );
      });
      return {
        date: day,
        transactions: dayTransactions,
      };
    });
    setData(_data);
  }, [
    allExpenses,
    allRepayments,
    allIncomes,
    allPaychecks,
    allPurchases,
    allSales,
    allBorrows,
    types,
    days,
  ]);

  const numWeeks = Math.ceil(days.length / 7);
  return (
    <Grid
      container
      columns={7}
      sx={{ backgroundColor: 'surface.250', borderRadius: 1 }}
    >
      {range(7).map((idx) => (
        <Grid
          key={`week-day-letter-${idx}`}
          size={{ xs: 1 }}
          py={0.5}
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
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
              transactions={day.transactions}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
