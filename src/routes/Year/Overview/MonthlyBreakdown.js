import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { MONTH_NAMES } from './MonthlyLineChart';
import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import BoxFlexColumn from '../../../components/BoxFlexColumn';
import CustomIconButton from '../../../components/CustomIconButton';

const MonthBox = (props) => {
  const { year, month, incomeSum, expenseSum } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const date = dayjs().year(year).month(month);

  const handleClick = () => {
    dispatch(push('/dashboard/overview', { year, month }));
  };

  const net = incomeSum - expenseSum;
  const color = net >= 0 ? theme.palette.green : theme.palette.red;
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
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 1,
        }}
      >
        <BoxFlexColumn alignItems='flex-start' sx={{ width: '33%' }}>
          <Typography align='left' variant='body2' color='text.secondary'>
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
    <Card raised sx={{ maxWidth: 650, width: '100%' }}>
      <Stack spacing={1} direction='column' pt={1} pb={1}>
        {map(MONTH_NAMES, (_, month) => {
          const incomeSum = incomeSumByMonth[month];
          const expenseSum = expenseSumByMonth[month];

          if (incomeSum === 0 && expenseSum === 0) return null;
          return (
            <React.Fragment key={year + month}>
              {month !== 0 && <Divider />}
              <MonthBox
                key={month}
                year={year}
                month={month}
                incomeSum={incomeSum}
                expenseSum={expenseSum}
              />
            </React.Fragment>
          );
        })}
      </Stack>
    </Card>
  );
}
