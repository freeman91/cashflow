import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import dayjs from 'dayjs';
import Record from './Record';
import { map } from 'lodash';

export default function Day({ date, expenses, incomes, hours }) {
  const theme = useTheme();
  let isToday = dayjs().isSame(date, 'day');

  return (
    <Paper
      variant='outlined'
      sx={{
        flex: 1,
        height: '10rem',
        backgroundColor: theme.palette.grey[900],
        mr: date.day() === 6 ? 0 : '.5rem',
      }}
    >
      <Typography
        sx={{
          float: 'right',
          width: '1.5rem',
          mt: '.2rem',
          mb: '1rem',
          mr: '.5rem',
          bgcolor: isToday
            ? theme.palette.red[800]
            : theme.palette.background.paper,
          borderRadius: '.5rem',
        }}
      >
        {date.date()}
      </Typography>
      <div style={{ marginTop: '2.5rem' }} />
      {map(hours, (hour) => {
        return <Record key={hour.id} data={hour} />;
      })}
      {map(incomes, (income) => {
        return <Record key={income.id} data={income} />;
      })}
      {map(expenses, (expense) => {
        return <Record key={expense.id} data={expense} />;
      })}
    </Paper>
  );
}
