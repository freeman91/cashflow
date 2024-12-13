import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import { darken, lighten } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { ASSETS, DEBTS } from './index';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import CustomIconButton from '../../components/CustomIconButton';
import BoxFlexColumn from '../../components/BoxFlexColumn';

const numberToRoundedCurrency = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const BoxCurrencyDisplay = (props) => {
  const { value, label, color, icon, orientation, selected, onClick } = props;

  let color1 = lighten(color, 0.25);
  let color2 = color;
  let disabledTextColor = 'rgb(255, 255, 255, 0.25)';

  if (!selected) {
    color1 = darken(color1, 0.6);
    color2 = darken(color2, 0.6);
  }

  const deg = orientation === 'right' ? '90deg' : '-90deg';
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        width: 175,
        height: 75,
        background: `linear-gradient(${deg}, ${color1}, ${color2})`,
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
        <CustomIconButton color={color2}>{icon}</CustomIconButton>
      )}

      <BoxFlexColumn
        alignItems={orientation === 'left' ? 'flex-start' : 'flex-end'}
      >
        <Typography
          variant='body1'
          fontWeight={'bold'}
          sx={{
            color: selected ? 'text.primary' : disabledTextColor,
          }}
        >
          {label}
        </Typography>
        <BoxFlexCenter>
          <Typography
            variant='h6'
            sx={{
              color: selected ? 'text.secondary' : disabledTextColor,
            }}
          >
            $
          </Typography>
          <Typography
            variant='h5'
            sx={{
              color: selected ? 'text.primary' : disabledTextColor,
            }}
            fontWeight='bold'
          >
            {numberToRoundedCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
      {orientation === 'left' && (
        <CustomIconButton color={color2}>{icon}</CustomIconButton>
      )}
    </Box>
  );
};

export default function NetworthContainer(props) {
  const { networthId, tab, setTab } = props;
  const theme = useTheme();

  const networths = useSelector((state) => state.networths.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [networth, setNetworth] = useState(null);
  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    if (networthId) {
      setNetworth(find(networths, { networth_id: networthId }));
    } else {
      setNetworth(null);
    }
  }, [networths, networthId]);

  useEffect(() => {
    if (!networth) {
      setAssetSum(reduce(allAssets, (sum, asset) => sum + asset.value, 0));
    } else {
      setAssetSum(
        reduce(networth.assets, (sum, asset) => sum + asset.value, 0)
      );
    }
  }, [allAssets, networth]);

  useEffect(() => {
    if (!networth) {
      setDebtSum(reduce(allDebts, (sum, debt) => sum + debt.amount, 0));
    } else {
      setDebtSum(
        reduce(
          networth.debts,
          (sum, debt) => {
            return sum + debt.value;
          },
          0
        )
      );
    }
  }, [allDebts, networth]);

  const net = assetSum - debtSum;
  if (!networth) return null;
  console.log('theme.palette.error.main: ', theme.palette.error.main);
  return (
    <Grid item xs={12} mx={1}>
      <Box>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(net)}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body1' align='center' color='text.secondary'>
          {`${dayjs(networth.date).format('MMMM YYYY')}`}
        </Typography>
      </Box>
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
          label={ASSETS}
          color={theme.palette.success.main}
          icon={<AccountBalanceWalletIcon />}
          orientation='left'
          selected={tab === ASSETS}
          onClick={() => setTab(ASSETS)}
        />
        <BoxCurrencyDisplay
          value={debtSum}
          label={DEBTS}
          color={theme.palette.error.main}
          icon={<CreditCardIcon />}
          orientation='right'
          selected={tab === DEBTS}
          onClick={() => setTab(DEBTS)}
        />
      </Box>
    </Grid>
  );
}
