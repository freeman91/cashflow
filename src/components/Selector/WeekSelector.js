import React from 'react';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export default function WeekSelector({ date }) {
  return (
    <>
      <Button variant='outlined'>
        {date.day(0).format('MMM, Do') + ' - ' + date.day(6).format('MMM, Do')}
      </Button>
    </>
  );
}
