import React from 'react';
import dayjs from 'dayjs';

import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';

export default function MonthYearSelector({ date, handleDateChange }) {
  const handleDateSelect = (e) => {
    handleDateChange(e);
  };

  return (
    <DatePicker
      views={['year', 'month']}
      maxDate={dayjs().add(1, 'year').toDate()}
      minDate={dayjs('2018-01-01').toDate()}
      value={date}
      onChange={handleDateSelect}
      renderInput={(params) => (
        <TextField
          variant='standard'
          margin='normal'
          {...params}
          helperText={null}
        />
      )}
    />
  );
}
