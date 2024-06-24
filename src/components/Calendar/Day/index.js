import React from 'react';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Day({
  date,
  onClick,
  expenses,
  incomes,
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

  const paidExpenses = filter(expenses, { pending: false });
  const pendingExpenses = filter(expenses, { pending: true });

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
        direction='column'
        // spacing={1}
        justifyContent='center'
        sx={{ height: 20 }}
      >
        {incomes.length > 0 && (
          <Typography
            align='center'
            variant='body2'
            sx={{ opacity }}
            color={theme.palette.green[600]}
            fontWeight='bold'
            lineHeight={0.5}
          >
            {`•`.repeat(incomes.length)}
          </Typography>
        )}

        {paidExpenses.length > 0 && (
          <Typography
            align='center'
            variant='body2'
            sx={{ opacity }}
            color={theme.palette.red[600]}
            fontWeight='bold'
            lineHeight={0.5}
          >
            {`•`.repeat(paidExpenses.length)}
          </Typography>
        )}

        {pendingExpenses.length > 0 && (
          <Typography
            align='center'
            variant='body2'
            sx={{ opacity }}
            color={theme.palette.red[300]}
            fontWeight='bold'
            lineHeight={0.5}
          >
            {`•`.repeat(pendingExpenses.length)}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
