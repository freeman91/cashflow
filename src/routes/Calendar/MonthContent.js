import React from 'react';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import map from 'lodash/map';
import range from 'lodash/range';

import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Day from './Day';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MonthContent(props) {
  const {
    selectedDate,
    days,
    setSelectedDate,
    monthExpenses,
    monthIncomes,
    showWeights,
  } = props;

  const renderWeeks = () => {
    let weeks = [];
    let _days = cloneDeep(days);

    let week = 1;
    weeks.push(
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        key='week-day-letter'
        spacing={1}
        bgcolor='surface.250'
      >
        {map(range(7), (idx) => {
          return (
            <Typography
              key={idx}
              align='center'
              sx={{ width: '14%' }}
              variant='body2'
            >
              {daysOfWeek[idx]}
            </Typography>
          );
        })}
      </Stack>
    );

    while (_days.length > 0) {
      weeks.push(
        <Divider
          key={`divider-${week}`}
          sx={{ borderColor: (theme) => theme.palette.grey[40] }}
        />
      );
      weeks.push(
        <Stack
          key={`week-stack-${week}`}
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
          pt={0.5}
          pb={0.5}
          bgcolor='surface.250'
        >
          {map(range(7), (idx) => {
            let _day = _days.shift();

            let expenses = filter(monthExpenses, (expense) => {
              return dayjs(expense.date).isSame(_day, 'day');
            });
            let incomes = filter(monthIncomes, (income) => {
              return dayjs(income.date).isSame(_day, 'day');
            });

            return (
              <Day
                key={`day-${_day.format('YYYY-MM-DD')}`}
                date={_day}
                selectedDate={selectedDate}
                expenses={expenses}
                incomes={incomes}
                onClick={() => setSelectedDate(_day)}
                showWeights={showWeights}
              />
            );
          })}
        </Stack>
      );
      week = week + 1;
    }
    weeks.push(
      <Divider
        key='divider-end'
        sx={{ borderColor: (theme) => theme.palette.grey[40] }}
      />
    );
    return weeks;
  };

  return renderWeeks();
}
