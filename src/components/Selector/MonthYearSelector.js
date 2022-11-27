import React, { useState } from 'react';
import dayjs from 'dayjs';

import { Button, Popover } from '@mui/material';
import { MonthPicker, YearPicker } from '@mui/x-date-pickers';

export default function MonthYearSelector({
  date,
  handleDateChange,
  interval,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleYearClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (e) => {
    handleDateChange(e);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;

  return (
    <>
      <Button
        onClick={handleYearClick}
        variant='text'
        sx={{
          minWidth: '10rem',
          '&.MuiButton-text': {
            fontSize: 22,
          },
        }}
      >
        {interval === 'year' ? date.format('YYYY') : date.format('MMMM')}
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
        {interval === 'year' ? (
          <YearPicker
            date={date}
            maxDate={dayjs().add(1, 'year').toDate()}
            minDate={dayjs('2018-01-01').toDate()}
            onChange={handleDateSelect}
          />
        ) : (
          <MonthPicker
            date={date}
            maxDate={dayjs().add(2, 'month').toDate()}
            minDate={dayjs('2018-01-01').toDate()}
            onChange={handleDateSelect}
          />
        )}
      </Popover>
    </>
  );
}
