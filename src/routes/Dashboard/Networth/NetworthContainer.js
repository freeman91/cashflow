import React from 'react';
import dayjs from 'dayjs';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../helpers/currency';
import { useTheme } from '@emotion/react';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import CustomIconButton from '../../../components/CustomIconButton';
import BoxFlexColumn from '../../../components/BoxFlexColumn';

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
  const { assetSum, debtSum, year, month, subtitle = null } = props;
  const theme = useTheme();

  const net = assetSum - debtSum;
  return (
    <Grid
      item
      xs={12}
      mx={1}
      sx={{ pt: '0 !important', maxWidth: '400px !important' }}
      mb={-1}
    >
      <Box sx={{ mb: 6 }}>
        <BoxFlexCenter>
          <Typography variant='h4' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h4' color='white' fontWeight='bold'>
            {_numberToCurrency.format(net)}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body2' align='center' color='text.secondary'>
          {subtitle
            ? subtitle
            : dayjs()
                .year(year)
                .month(month - 1)
                .format('MMMM YYYY')}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'relative',
          height: 50,
          width: 50,
          top: -90,
          left: '15%',
          borderWidth: '2px',
          borderTopStyle: 'dashed',
          borderLeftStyle: 'dashed',
          borderTopColor: theme.palette.green[400],
          borderLeftColor: theme.palette.green[400],
          borderTopLeftRadius: '15px',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          height: 50,
          width: 50,
          top: -140,
          left: '72%',
          borderWidth: '2px',
          borderTopStyle: 'dashed',
          borderRightStyle: 'dashed',
          borderTopColor: theme.palette.red[300],
          borderRightColor: theme.palette.red[300],
          borderTopRightRadius: '15px',
          mb: '-145px',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
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
    </Grid>
  );
}
