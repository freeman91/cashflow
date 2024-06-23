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
  selectedDate,
}) {
  const theme = useTheme();
  const isToday = dayjs().isSame(date, 'day');
  const isSameDayAsSelected = dayjs(selectedDate).isSame(date, 'day');
  const opacity = date.isSame(selectedDate, 'month') ? 1 : 0.25;

  const dateNumberColor = (() => {
    if (isToday) return theme.palette.blue[500];
    if (isSameDayAsSelected) return theme.palette.grey[800];
    return theme.palette.text.primary;
  })();

  return (
    <Box
      sx={{
        width: '14%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      <Typography
        align='center'
        variant='h6'
        sx={{
          opacity,
          height: '30px',
          width: '30px',
          color: dateNumberColor,
          backgroundColor: isSameDayAsSelected ? 'white' : 'transparent',
          borderRadius: '50%',
        }}
        fontWeight={isSameDayAsSelected ? 'bold' : 'regular'}
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
            lineHeight={0.5}
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
            lineHeight={0.5}
          >
            •
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
