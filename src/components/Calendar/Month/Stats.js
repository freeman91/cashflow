import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { filter, get, reduce } from 'lodash';
import dayjs from 'dayjs';

import { useTheme } from '@mui/styles';
import { numberToCurrency } from '../../../helpers/currency';

function StatBox({ color, value, label }) {
  const content = () => {
    return (
      <Box>
        <Typography
          variant='h5'
          sx={{
            borderBottom: `3px solid ${color}`,
          }}
        >
          {value ? value : '$0.00'}
        </Typography>
        <Typography variant='body2'>{label}</Typography>
      </Box>
    );
  };

  return content();
}

export default function Stats({ date }) {
  let now = dayjs();
  const theme = useTheme();
  const [day, setDay] = useState(now);

  const expenses = useSelector((state) =>
    filter(state.expenses.data, (expense) => {
      return day.isSame(dayjs(get(expense, 'date')), 'month');
    })
  );

  const incomes = useSelector((state) =>
    filter(state.incomes.data, (income) => {
      return day.isSame(dayjs(get(income, 'date')), 'month');
    })
  );

  useEffect(() => {
    if (date) {
      setDay(date);
    }
  }, [date]);

  let expenseSum = reduce(
    expenses,
    (acc, expense) => {
      return acc + get(expense, 'amount');
    },
    0
  );

  let incomeSum = reduce(
    incomes,
    (acc, income) => {
      return acc + get(income, 'amount');
    },
    0
  );

  return (
    <Stack
      direction='row'
      justifyContent='space-evenly'
      alignItems='center'
      spacing={1}
      width='100%'
      mt={1}
    >
      <StatBox
        color={theme.palette.yellow[500]}
        value={numberToCurrency.format(incomeSum - expenseSum)}
        label='net'
      />

      <StatBox
        color={theme.palette.green[500]}
        value={numberToCurrency.format(incomeSum)}
        label='income'
      />

      <StatBox
        color={theme.palette.red[500]}
        value={numberToCurrency.format(expenseSum)}
        label='expense'
      />
    </Stack>
  );
}
