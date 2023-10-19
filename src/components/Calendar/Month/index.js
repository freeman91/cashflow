import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { cloneDeep, get, filter, map, range, includes } from 'lodash';
import dayjs from 'dayjs';

import { useTheme } from '@mui/styles';
import { Stack } from '@mui/material';

import Day from '../Day';
import Stats from './Stats';

export default function Month({
  day,
  showExpenses,
  showIncomes,
  selectedTypes,
}) {
  const theme = useTheme();
  const [days, setDays] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [monthIncomes, setMonthIncomes] = useState([]);

  const allExpenses = useSelector((state) => state.expenses.data);
  const allIncomes = useSelector((state) => state.incomes.data);

  useEffect(() => {
    let firstDayOfMonth = day.date(1);
    let firstDayOfWeek = firstDayOfMonth.day(0);

    const filterRecords = (records) => {
      return filter(records, (record) => {
        const expDay = dayjs(record.date);
        const BOM = firstDayOfWeek;
        const EOM = day.endOf('month').day(6);
        return (
          (expDay.isAfter(BOM, 'day') || expDay.isSame(BOM, 'day')) &&
          (expDay.isBefore(EOM, 'day') || expDay.isSame(EOM, 'day'))
        );
      });
    };

    setMonthExpenses(filterRecords(allExpenses));
    setMonthIncomes(filterRecords(allIncomes));

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
  }, [day, allExpenses, allIncomes]);

  const renderWeeks = () => {
    let weeks = [];
    let _days = cloneDeep(days);

    // console.log('monthExpenses: ', monthExpenses);

    let week = 1;
    while (_days.length > 0) {
      weeks.push(
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          key={`week-stack-${week}`}
          spacing={1}
          pb={1}
        >
          {map(range(7), () => {
            let _day = _days.shift();

            let expenses = filter(monthExpenses, (expense) => {
              return (
                dayjs(expense.date).isSame(_day, 'day') &&
                includes(selectedTypes, get(expense, 'type'))
              );
            });
            let incomes = filter(monthIncomes, (income) => {
              return dayjs(income.date).isSame(_day, 'day');
            });

            return (
              <Day
                key={`day-${_day.format('YYYY-MM-DD')}`}
                date={_day}
                sameMonth={_day.isSame(day, 'month')}
                expenses={showExpenses ? expenses : []}
                incomes={showIncomes ? incomes : []}
              />
            );
          })}
        </Stack>
      );
      week = week + 1;
    }
    return weeks;
  };

  return (
    <div style={{ marginTop: theme.spacing(1) }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(1),
        }}
      >
        <Stats
          date={day}
          showExpenses={showExpenses}
          showIncomes={showIncomes}
          selectedTypes={selectedTypes}
        />
      </div>
      {renderWeeks()}
    </div>
  );
}
