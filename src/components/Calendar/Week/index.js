import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { map, range } from 'lodash';
import Day from './Day';

export default function Week({ date }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    let _date = date ? date : dayjs();
    let firstDayOfWeek = _date.subtract(_date.day(), 'day');

    setDays(
      map(range(7), (dayOfWeek) => {
        return firstDayOfWeek.add(dayOfWeek, 'day');
      })
    );
  }, [date]);

  return (
    <>
      {/* RangeSelection */}
      <Typography align='left' variant='h5' sx={{ mb: '.5rem' }}>
        This Week
      </Typography>
      <Stack direction='row' justifyContent='space-around' alignItems='center'>
        {map(days, (day) => {
          return <Day key={`day-${day.format('YYYY-MM-DD')}`} date={day} />;
        })}
      </Stack>
    </>
  );
}
