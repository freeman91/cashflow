import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import BoxFlexColumn from '../../../components/BoxFlexColumn';
import { MONTHS } from '.';

const MonthBox = (props) => {
  const { year, month, incomeSum, expenseSum } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const date = dayjs().year(year).month(month);

  const handleClick = () => {
    dispatch(push(`/summary/${year}/${month + 1}`));
  };

  const net = incomeSum - expenseSum;
  const color = net >= 0 ? theme.palette.green[400] : theme.palette.red[400];

  return (
    <Box
      onClick={handleClick}
      sx={{
        background: `linear-gradient(0deg, ${theme.palette.surface[250]}, ${theme.palette.surface[300]})`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        pr: 2,
        border: `2px solid ${color}`,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 2,
        }}
      >
        <BoxFlexColumn alignItems='flex-start' sx={{ width: '33%' }}>
          <Typography align='left' variant='body2' color='grey.0'>
            {date.format('MMMM')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h6' color='grey.10'>
              $
            </Typography>
            <Typography variant='h6' color='white' fontWeight='bold'>
              {_numberToCurrency.format(incomeSum - expenseSum)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn sx={{ width: '33%' }}>
          <BoxFlexCenter>
            <Typography variant='body1' color='grey.10'>
              $
            </Typography>
            <Typography variant='body1' color='white' fontWeight='bold'>
              {_numberToCurrency.format(incomeSum)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='flex-end' sx={{ width: '33%' }}>
          <BoxFlexCenter>
            <Typography variant='body1' color='grey.10'>
              $
            </Typography>
            <Typography variant='body1' color='white' fontWeight='bold'>
              {_numberToCurrency.format(expenseSum)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function MonthlyBreakdown(props) {
  const { year, incomeSumByMonth, expenseSumByMonth } = props;

  return (
    <Stack
      spacing={1}
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      {map(MONTHS, (month) => {
        const incomeSum = incomeSumByMonth[month];
        const expenseSum = expenseSumByMonth[month];

        if (incomeSum === 0 && expenseSum === 0) return null;
        return (
          <MonthBox
            key={month}
            year={year}
            month={month}
            incomeSum={incomeSum}
            expenseSum={expenseSum}
          />
        );
      })}
    </Stack>
  );
}
