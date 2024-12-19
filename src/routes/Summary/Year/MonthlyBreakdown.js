import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import map from 'lodash/map';

import useTheme from '@mui/material/styles/useTheme';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { MONTHS } from './MonthlyLineChart';
import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import BoxFlexColumn from '../../../components/BoxFlexColumn';

function CustomIconButton(props) {
  const { color, children } = props;
  const theme = useTheme();
  return (
    <IconButton
      sx={{
        color: color,
        background: `linear-gradient(45deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
        boxShadow: 6,
        borderRadius: '50%',
        p: '4px',
      }}
    >
      {children}
    </IconButton>
  );
}

const MonthBox = (props) => {
  const { year, month, incomeSum, expenseSum } = props;
  const dispatch = useDispatch();

  const date = dayjs().year(year).month(month);
  const handleClick = () => {
    dispatch(push(`/summary/${year}/${month + 1}`));
  };

  const net = incomeSum - expenseSum;
  const color = net >= 0 ? 'success.main' : 'error.main';
  const icon = net >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
  return (
    <Box
      onClick={handleClick}
      sx={{
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        pl: 1,
        pr: 2,
        cursor: 'pointer',
      }}
    >
      <CustomIconButton color={color}>{icon}</CustomIconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          width: '100%',
          ml: 1,
        }}
      >
        <BoxFlexColumn alignItems='flex-start' sx={{ width: '33%' }}>
          <Typography align='left' variant='body1' color='text.secondary'>
            {date.format('MMMM')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' fontWeight='bold' sx={{ color }}>
              {_numberToCurrency.format(incomeSum - expenseSum)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn sx={{ width: '33%' }}>
          <BoxFlexCenter>
            <Typography variant='body1' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' color='white' fontWeight='bold'>
              {_numberToCurrency.format(incomeSum)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='flex-end' sx={{ width: '33%' }}>
          <BoxFlexCenter>
            <Typography variant='body1' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' color='white' fontWeight='bold'>
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
    <>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Box
          sx={{
            display: 'flex',
            ml: 5,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box sx={{ width: '33%' }} />
          <Typography
            align='center'
            variant='body1'
            color='text.secondary'
            sx={{ width: '33%' }}
          >
            earned
          </Typography>
          <Typography
            align='center'
            variant='body1'
            color='text.secondary'
            sx={{ width: '33%' }}
          >
            spent
          </Typography>
        </Box>
      </Grid>
      {map(MONTHS, (month, idx) => {
        const incomeSum = incomeSumByMonth[month];
        const expenseSum = expenseSumByMonth[month];

        if (incomeSum === 0 && expenseSum === 0) return null;
        return (
          <Grid
            key={year + month}
            item
            xs={12}
            mx={1}
            sx={{ pt: idx === 0 ? '0 !important' : 1 }}
          >
            <Card
              sx={{
                width: '100%',
                py: 0.5,
                '&:hover': {
                  backgroundColor: 'surface.150',
                },
                cursor: 'pointer',
              }}
            >
              <MonthBox
                key={month}
                year={year}
                month={month}
                incomeSum={incomeSum}
                expenseSum={expenseSum}
              />
            </Card>
          </Grid>
        );
      })}
    </>
  );
}
