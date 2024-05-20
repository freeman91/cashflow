import React, { useState } from 'react';
import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function Year() {
  const [date] = useState(dayjs());
  return (
    <>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography variant='body1' align='center' fontWeight='bold'>
          {date.format('YYYY')}
        </Typography>
        <Typography variant='body1' align='center'>
          Totals
        </Typography>
        <Typography variant='body1' align='center'>
          List of Months
        </Typography>
      </Stack>
    </>
  );
}
