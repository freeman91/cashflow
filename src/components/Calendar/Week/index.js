import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { map } from 'lodash';

import { useTheme } from '@mui/styles';
import { IconButton, Stack, Tooltip } from '@mui/material';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Day from '../Day';
import { WeekSelector } from '../../Selector';
dayjs.extend(advancedFormat);

export default function Week({ date, setView }) {
  const theme = useTheme();
  const [days, setDays] = useState([]);
  const [day, setDay] = useState(dayjs);

  useEffect(() => {
    if (date) {
      setDay(date);
    }
  }, [date]);

  useEffect(() => {
    let _days = [];
    let firstDayOfWeek = day.day(0);

    let currentDay = firstDayOfWeek;
    while (currentDay.isSame(firstDayOfWeek, 'week')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    setDays(_days);
  }, [day]);

  const handleBackClick = () => {
    setDay(day.subtract(1, 'week'));
  };

  const handleForwardClick = () => {
    setDay(day.add(1, 'week'));
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(1),
        }}
      >
        <Tooltip title='View Month' placement='top'>
          <IconButton onClick={() => setView('month')}>
            <ViewComfyIcon />
          </IconButton>
        </Tooltip>

        <IconButton onClick={handleBackClick}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <WeekSelector date={day} />
        <IconButton onClick={handleForwardClick}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      <Stack
        direction='row'
        justifyContent='space-around'
        alignItems='center'
        spacing={1}
        pb={1}
      >
        {map(days, (_day) => {
          return (
            <Day
              key={`day-${_day.format('YYYY-MM-DD')}`}
              date={_day}
              sameMonth={_day.isSame(day, 'month')}
            />
          );
        })}
      </Stack>
    </div>
  );
}
