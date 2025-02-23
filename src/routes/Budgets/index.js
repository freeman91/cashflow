import React, { useState } from 'react';
import dayjs from 'dayjs';

import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Budgets() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [date, setDate] = useState(dayjs());

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        width: '100%',
        maxWidth: '1500px',
        margin: 'auto',
        px: 1,
        pb: 6,
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-start',
            alignItems: 'center',
            gap: 2,
            mx: 2,
          }}
        >
          <DatePicker
            size='medium'
            value={date}
            onChange={(value) => {
              setDate(value.date(15));
            }}
            format='MMMM YYYY'
            views={['month', 'year']}
            sx={{ width: 180 }}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                inputProps: { style: { fontSize: 20 } },
              },
              inputAdornment: {
                position: 'start',
              },
            }}
          />
          <Box>
            <IconButton onClick={() => setDate(date.subtract(1, 'month'))}>
              <ArrowBack />
            </IconButton>
            <IconButton onClick={() => setDate(date.add(1, 'month'))}>
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
