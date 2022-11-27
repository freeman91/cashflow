import React, { useEffect, useState } from 'react';
import { cloneDeep, map, range } from 'lodash';

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

  useEffect(() => {
    let firstDayOfMonth = day.date(1);
    let firstDayOfWeek = firstDayOfMonth.day(0);
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
  }, [day]);

  const renderWeeks = () => {
    let weeks = [];
    let _days = cloneDeep(days);

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
            return (
              <Day
                key={`day-${_day.format('YYYY-MM-DD')}`}
                date={_day}
                sameMonth={_day.isSame(day, 'month')}
                showExpenses={showExpenses}
                showIncomes={showIncomes}
                selectedTypes={selectedTypes}
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
