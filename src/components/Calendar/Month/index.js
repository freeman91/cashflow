import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { IconButton, Stack, Tooltip } from '@mui/material';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { cloneDeep, map, range } from 'lodash';

import Day from '../Day';
import { MonthSelector } from '../../Selector';
import Stats from './Stats';

export default function Month({ date, setView }) {
  const theme = useTheme();
  const [days, setDays] = useState([]);
  const [day, setDay] = useState(dayjs());

  useEffect(() => {
    if (date) {
      setDay(date);
    }
  }, [date]);

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

  const handleMonthChange = (selectedDate) => {
    setDay(dayjs(selectedDate));
  };

  const handleBackClick = () => {
    setDay(day.subtract(1, 'month'));
  };

  const handleForwardClick = () => {
    setDay(day.add(1, 'month'));
  };

  const renderWeeks = () => {
    let weeks = [];
    let _days = cloneDeep(days);

    let week = 1;
    while (_days.length > 0) {
      weeks.push(
        <Stack
          direction='row'
          justifyContent='space-around'
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
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(1),
        }}
      >
        <Tooltip title='View Week' placement='top'>
          <IconButton onClick={() => setView('week')}>
            <ViewWeekIcon />
          </IconButton>
        </Tooltip>

        <IconButton onClick={handleBackClick}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <MonthSelector date={day} handleMonthChange={handleMonthChange} />
        <IconButton onClick={handleForwardClick}>
          <ArrowForwardIosIcon />
        </IconButton>
        <Stats date={day} />
      </div>
      {renderWeeks()}
    </>
  );
}
