import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map, filter, get } from 'lodash';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/styles';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';

import Record from './Record';
import { setCreateDialog } from '../../../store/settings';

export default function Day({ date, sameMonth }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  let isToday = dayjs().isSame(date, 'day');

  const expenses = useSelector((state) =>
    filter(state.expenses.data, (expense) => {
      return get(expense, 'date') === date.format('YYYY-MM-DD');
    })
  );

  const incomes = useSelector((state) =>
    filter(state.incomes.data, (income) => {
      return get(income, 'date') === date.format('YYYY-MM-DD');
    })
  );

  const handleClick = () => {
    dispatch(
      setCreateDialog({
        date: date,
        open: true,
      })
    );
  };

  return (
    <Paper
      variant='outlined'
      sx={{
        width: '10rem',
        height: '10rem',
        backgroundColor: theme.palette.grey[900],
        opacity: sameMonth ? 1 : 0.5,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          float: 'left',
          height: '1rem',
          width: '1rem',
          mt: '.3rem',
          ml: '.5rem',
        }}
      >
        <AddIcon />
      </IconButton>
      <Typography
        sx={{
          float: 'right',
          width: '1.5rem',
          mt: '.2rem',

          mr: '.5rem',
          bgcolor: isToday
            ? theme.palette.red[800]
            : theme.palette.background.paper,
          borderRadius: '10px',
        }}
      >
        {date.date()}
      </Typography>
      <Box sx={{ width: '100%', justifyContent: 'center' }}>
        <Stack sx={{ width: '100%' }}>
          {map(incomes, (income) => {
            return <Record key={income.id} data={income} />;
          })}
          {map(expenses, (expense) => {
            return <Record key={expense.id} data={expense} />;
          })}
        </Stack>
      </Box>
    </Paper>
  );
}
