import React from 'react';
import dayjs from 'dayjs';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { useTheme } from '@emotion/react';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import CustomIconButton from '../../components/CustomIconButton';
import BoxFlexColumn from '../../components/BoxFlexColumn';

const numberToRoundedCurrency = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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
            {numberToRoundedCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
      {orientation === 'left' && (
        <CustomIconButton color={color}>{icon}</CustomIconButton>
      )}
    </Box>
  );
};

export default function NetworthContainer(props) {
  const { assetSum, debtSum, year, month } = props;
  const theme = useTheme();

  const net = assetSum - debtSum;
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
          {dayjs()
            .year(year)
            .month(month - 1)
            .format('MMMM YYYY')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <BoxCurrencyDisplay
            value={assetSum}
            label='assets'
            color={theme.palette.green}
            icon={<AccountBalanceWalletIcon />}
            orientation='left'
          />
          <BoxCurrencyDisplay
            value={debtSum}
            label='debts'
            color={theme.palette.red}
            icon={<CreditCardIcon />}
            orientation='right'
          />
        </Box>
      </Box>
    </Grid>
  );
}
