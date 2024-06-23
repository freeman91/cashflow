import React from 'react';
import dayjs from 'dayjs';

import { DatePicker } from '@mui/x-date-pickers';

export default function MonthYearSelector({ date, handleDateChange }) {
  const handleDateSelect = (e) => {
    handleDateChange(e);
  };

  return (
    <DatePicker
      views={['year', 'month']}
      maxDate={dayjs().add(1, 'month')}
      minDate={dayjs('2018-01-01')}
      value={date}
      onChange={handleDateSelect}
      slotProps={{
        textField: {
          variant: 'standard',
          textAlign: 'center',
          margin: 'normal',
          InputProps: { disableUnderline: true },
          inputProps: { style: { textAlign: 'center' } },
        },
      }}
    />
  );
}
