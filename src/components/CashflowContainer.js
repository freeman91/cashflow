import React from 'react';

import { useTheme } from '@emotion/react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';
import BoxFlexColumn from './BoxFlexColumn';
import CustomIconButton from './CustomIconButton';

const BoxCurrencyDisplay = (props) => {
  const { value, label, color, icon, orientation } = props;

  const deg = orientation === 'right' ? '90deg' : '-90deg';
  return (
    <Box
      sx={{
        position: 'relative',
        width: 175,
        height: 75,
        background: `linear-gradient(${deg}, ${color[200]}, ${color[400]})`,
        boxShadow: 6,
        zIndex: 1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        mt: 1,
      }}
    >
      {orientation === 'right' && (
        <CustomIconButton color={color}>{icon}</CustomIconButton>
      )}

      <BoxFlexColumn
        alignItems={orientation === 'left' ? 'flex-start' : 'flex-end'}
      >
        <Typography variant='body2' color='grey.0'>
          {label}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h5' color='grey.10'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
      {orientation === 'left' && (
        <CustomIconButton color={color}>{icon}</CustomIconButton>
      )}
    </Box>
  );
};

export default function CashflowContainer(props) {
  const { date, incomeSum, expenseSum } = props;
  const theme = useTheme();

  const net = incomeSum - expenseSum;

  return (
    <Grid item xs={12} mx={1}>
      <Box
        sx={{
          background: `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[400]} 75%)`,
          height: 140,
          width: '100%',
          pt: 2,
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BoxFlexCenter>
          {net < 0 && (
            <Typography variant='h4' color='grey.10'>
              -
            </Typography>
          )}
          <Typography variant='h4' color='grey.10'>
            $
          </Typography>
          <Typography variant='h4' color='white' fontWeight='bold'>
            {_numberToCurrency.format(Math.abs(net))}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body2' align='center' color='grey.10'>
          {date} cashflow
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <BoxCurrencyDisplay
            value={incomeSum}
            label='incomes'
            color={theme.palette.green}
            icon={<TrendingUpIcon />}
            orientation='left'
          />
          <BoxCurrencyDisplay
            value={expenseSum}
            label='expenses'
            color={theme.palette.red}
            icon={<TrendingDownIcon />}
            orientation='right'
          />
        </Box>
      </Box>
    </Grid>
  );
}
