import React, { useEffect, useState } from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { filter, get, reduce } from 'lodash';
import dayjs from 'dayjs';

import { numberToCurrency } from '../../../helpers/currency';
import { useTheme } from '@emotion/react';
import useProjectedIncome from '../../../hooks/useProjectedIncome';
import useProjectedExpense from '../../../hooks/useProjectedExpense';

function StatBox({ color, value, label, projectedValue }) {
  const content = () => {
    return (
      <Box>
        <Typography
          variant='h5'
          sx={{
            borderBottom: `3px solid ${color}`,
          }}
        >
          {value}
        </Typography>
        <Typography variant='body2'>{label}</Typography>
      </Box>
    );
  };

  if (projectedValue) {
    return (
      <Tooltip
        title={<Typography>Projected: {projectedValue}</Typography>}
        placement='left'
      >
        {content()}
      </Tooltip>
    );
  }

  return content();
}

export default function Stats({ date }) {
  let now = dayjs();
  const theme = useTheme();
  const [day, setDay] = useState(now);
  const projectedIncome = useProjectedIncome();
  const projectedExpense = useProjectedExpense();

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

  let projectedNetIncome = (() => {
    if (
      (projectedIncome === 0 && projectedExpense === 0) ||
      now.month() !== day.month() ||
      now.year() !== day.year()
    ) {
      return null;
    }
    if (projectedIncome === 0) {
      return numberToCurrency.format(incomeSum - projectedExpense);
    }
    return numberToCurrency.format(projectedIncome - projectedExpense);
  })();

  return (
    <Stack
      direction='row'
      justifyContent='space-evenly'
      alignItems='center'
      spacing={1}
      width='100%'
    >
      <StatBox
        color={theme.palette.yellow[500]}
        value={numberToCurrency.format(incomeSum - expenseSum)}
        projectedValue={projectedNetIncome}
        label='net'
      />

      <StatBox
        color={theme.palette.green[500]}
        value={incomeSum > 0 ? numberToCurrency.format(incomeSum) : null}
        projectedValue={
          projectedIncome > 0 &&
          now.month() === day.month() &&
          now.year() === day.year()
            ? numberToCurrency.format(projectedIncome)
            : null
        }
        label='income'
      />

      <StatBox
        color={theme.palette.red[500]}
        value={numberToCurrency.format(expenseSum)}
        projectedValue={
          projectedExpense > 0 &&
          now.month() === day.month() &&
          now.year() === day.year()
            ? numberToCurrency.format(projectedExpense)
            : null
        }
        label='expense'
      />
    </Stack>
  );
}
