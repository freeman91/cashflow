import React from 'react';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Day({
  date,
  onClick,
  hasExpenses,
  hasIncomes,
  sameMonth,
}) {
  const theme = useTheme();
  let isToday = dayjs().isSame(date, 'day');

  const opacity = sameMonth ? 1 : 0.25;

  return (
    <Box sx={{ width: '14%' }} onClick={onClick}>
      <Typography
        align='center'
        variant='h6'
        sx={{
          opacity,
          color: isToday ? theme.palette.grey[500] : theme.palette.text.primary,
        }}
      >
        {date.date()}
      </Typography>
      <Stack
        direction='row'
        spacing={1}
        justifyContent='center'
        sx={{ height: 20 }}
      >
        {hasExpenses && (
          <Typography
            align='center'
            variant='h4'
            fontWeight='bold'
            sx={{ opacity }}
            color={theme.palette.red[500]}
          >
            •
          </Typography>
        )}
        {hasIncomes && (
          <Typography
            align='center'
            variant='h4'
            fontWeight='bold'
            sx={{ opacity }}
            color={theme.palette.green[500]}
          >
            •
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
