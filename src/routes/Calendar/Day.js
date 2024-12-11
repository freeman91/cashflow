import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { findId } from '../../helpers/transactions';

const fontSizeWeights = {
  0: 4,
  10: 5,
  25: 6,
  50: 7,
  100: 8,
  250: 9,
  500: 10,
  1000: 11,
  2500: 12,
};

function getFontSize(value) {
  const sortedWeights = Object.keys(fontSizeWeights)
    .map(Number)
    .sort((a, b) => a - b);

  const weight = sortedWeights.filter((weight) => weight <= value).pop();
  if (!isNaN(weight)) {
    return fontSizeWeights[weight];
  }
  return fontSizeWeights[2500];
}

const findAmount = (transaction) => {
  if (transaction.amount) return transaction.amount;
  if (transaction.principal)
    return (
      transaction.principal +
      transaction.interest +
      (transaction.escrow ? transaction.escrow : 0)
    );
  if (transaction.take_home) return transaction.take_home;

  return 0;
};

const Circle = ({ diameter, color }) => {
  const circleStyle = {
    width: `${diameter}px`,
    height: `${diameter}px`,
    backgroundColor: color,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.1s, height 0.1s',
    margin: '1px',
  };

  return <Box style={circleStyle} />;
};

export default function Day({
  date,
  onClick,
  expenses,
  incomes,
  selectedDate,
  showWeights,
}) {
  const theme = useTheme();
  const isToday = dayjs().isSame(date, 'day');
  const isSameDayAsSelected = dayjs(selectedDate).isSame(date, 'day');
  const opacity = date.isSame(selectedDate, 'month') ? 1 : 0.25;

  const [_incomes, setIncomes] = useState([]);
  const [paidExpenses, setShowPaidExpenses] = useState([]);
  const [pendingExpenses, setShowPendingExpenses] = useState([]);

  useEffect(() => {
    let _expenses = map(expenses, (expense) => ({
      ...expense,
      amount: findAmount(expense),
    }));

    let _paidExpenses = filter(_expenses, { pending: false });
    let _pendingExpenses = filter(_expenses, { pending: true });

    setShowPaidExpenses(sortBy(_paidExpenses, 'amount'));
    setShowPendingExpenses(sortBy(_pendingExpenses, 'amount'));
  }, [expenses]);

  useEffect(() => {
    let _incomes = map(incomes, (income) => ({
      ...income,
      amount: findAmount(income),
    }));

    setIncomes(sortBy(_incomes, 'amount'));
  }, [incomes]);

  const dateNumberColor = (() => {
    if (isToday) return theme.palette.primary.main;
    if (isSameDayAsSelected) return theme.palette.grey[40];
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
        padding: 0.5,
        cursor: 'pointer',
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
          backgroundColor: isSameDayAsSelected
            ? 'white'
            : isToday
            ? 'surface.250'
            : 'transparent',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        fontWeight={isToday ? 'bold' : 'regular'}
      >
        {date.date()}
      </Typography>
      <Stack direction='column' justifyContent='center' sx={{ height: 20 }}>
        <Stack direction='row' alignItems='flex-end' justifyContent='center'>
          {incomes.length > 0 &&
            map(_incomes, (income) => {
              const fontSize = showWeights ? getFontSize(income.amount) : 4;
              return (
                <Circle
                  key={findId(income)}
                  color={theme.palette.success.main}
                  diameter={fontSize}
                />
              );
            })}
        </Stack>

        {paidExpenses.length > 0 && (
          <Stack direction='row' alignItems='flex-end' justifyContent='center'>
            {map(paidExpenses, (expense, idx) => {
              const fontSize = showWeights ? getFontSize(expense.amount) : 4;
              return (
                <Circle
                  key={findId(expense)}
                  color={theme.palette.danger.main}
                  diameter={fontSize}
                />
              );
            })}
          </Stack>
        )}

        {pendingExpenses.length > 0 && (
          <Stack direction='row' alignItems='flex-end' justifyContent='center'>
            {map(pendingExpenses, (expense) => {
              const fontSize = showWeights ? getFontSize(expense.amount) : 4;
              return (
                <Circle
                  key={findId(expense)}
                  color={theme.palette.danger.secondary}
                  diameter={fontSize}
                />
              );
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
