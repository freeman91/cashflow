import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, map } from 'lodash';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import Stack from '@mui/material/Stack';

import Day from '../Day';

export default function ThisWeek() {
  const theme = useTheme();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const greaterThanMd = useMediaQuery(theme.breakpoints.up('md'));
  const smallToMid = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [date] = useState(dayjs().hour(12).minute(0).second(0));
  const [days, setDays] = useState([]);
  const [weekExpenses, setWeekExpenses] = useState([]);
  const [weekIncomes, setWeekIncomes] = useState([]);

  const daysAround = greaterThanMd ? 3 : smallToMid ? 2 : 1;

  useEffect(() => {
    let firstDay = date.subtract(daysAround, 'day').hour(0);
    let lastDay = date.add(daysAround, 'day').hour(23).minute(59);

    const filterRecords = (records) => {
      return filter(records, (record) => {
        const expDay = dayjs(record.date);
        return (
          (expDay.isAfter(firstDay, 'day') || expDay.isSame(firstDay, 'day')) &&
          (expDay.isBefore(lastDay, 'day') || expDay.isSame(lastDay, 'day'))
        );
      });
    };
    setWeekExpenses(filterRecords([...allExpenses, ...allRepayments]));
    setWeekIncomes(filterRecords([...allIncomes, ...allPaychecks]));
    let _days = [];
    let currentDay = firstDay;
    while (currentDay.isBefore(lastDay, 'day')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }
    while (currentDay.isSame(lastDay, 'day')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }
    setDays(_days);
  }, [date, allExpenses, allIncomes, allRepayments, allPaychecks, daysAround]);

  return (
    <div style={{ width: '100%' }}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={1}
        pb={1}
        width='100%'
      >
        {map(days, (day) => {
          let expenses = filter(weekExpenses, (expense) => {
            return dayjs(expense.date).isSame(day, 'day');
          });
          let incomes = filter(weekIncomes, (income) => {
            return dayjs(income.date).isSame(day, 'day');
          });

          return (
            <Day
              key={`day-${day.format('YYYY-MM-DD')}`}
              date={day}
              sameMonth={true}
              expenses={expenses}
              incomes={incomes}
            />
          );
        })}
      </Stack>
    </div>
  );
}
