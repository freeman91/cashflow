import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { filter, map, range, get } from 'lodash';
import Day from './Day';
import { useSelector } from 'react-redux';

export default function Week({ date }) {
  const [days, setDays] = useState([]);
  const expenses = useSelector((state) => state.expenses.data);
  const incomes = useSelector((state) => state.incomes.data);
  const hours = useSelector((state) => state.hours.data);

  useEffect(() => {
    let _date = date ? date : dayjs();
    let firstDayOfWeek = _date.subtract(_date.day(), 'day');

    setDays(
      map(range(7), (dayOfWeek) => {
        let day = firstDayOfWeek.add(dayOfWeek, 'day');
        return {
          date: day,
          expenses: filter(expenses, (expense) => {
            return get(expense, 'date') === day.format('YYYY-MM-DD');
          }),
          incomes: filter(incomes, (income) => {
            return get(income, 'date') === day.format('YYYY-MM-DD');
          }),
          hours: filter(hours, (hour) => {
            return get(hour, 'date') === day.format('YYYY-MM-DD');
          }),
        };
      })
    );
  }, [date, expenses, incomes, hours]);

  return (
    <>
      {/* RangeSelection */}
      <Typography align='left' variant='h5' sx={{ mb: '.5rem' }}>
        This Week
      </Typography>
      <div style={{ display: 'flex' }}>
        {map(days, (day) => {
          return (
            <Day
              key={`day-${day.date.format('YYYY-MM-DD')}`}
              date={day.date}
              incomes={day.incomes}
              expenses={day.expenses}
              hours={day.hours}
            />
          );
        })}
      </div>
    </>
  );
}
