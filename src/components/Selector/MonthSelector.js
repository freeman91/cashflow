import React, { useState } from 'react';
import dayjs from 'dayjs';

import { Button, Popover } from '@mui/material';
import { MonthPicker } from '@mui/x-date-pickers/MonthPicker';

export default function MonthSelector({ date, handleMonthChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMonthClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'month-picker-popover' : undefined;

  return (
    <>
      <Button
        onClick={handleMonthClick}
        variant='outlined'
        sx={{ minWidth: '10rem' }}
      >
        {date.format('MMMM')}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MonthPicker
          date={date.toDate()}
          maxDate={dayjs().add(1, 'month').toDate()}
          minDate={dayjs('2018-01-01').toDate()}
          onChange={handleMonthChange}
        />
      </Popover>
    </>
  );
}
