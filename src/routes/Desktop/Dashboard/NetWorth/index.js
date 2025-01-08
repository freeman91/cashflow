import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import { numberToCurrency } from '../../../../helpers/currency';

export default function NetWorth() {
  const histories = useSelector((state) => state.histories.data);
  const networths = useSelector((state) => state.networths.data);
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  console.log('histories: ', histories);

  const [networth, setNetworth] = useState(0);
  const [difference, setDifference] = useState(0);
  const [differenceAttrs, setDifferenceAttrs] = useState({
    color: 'text.secondary',
    symbol: null,
  });

  useEffect(() => {
    const monthHistories = histories.filter(
      (history) => history.month === dayjs().format('YYYY-MM')
    );
    monthHistories.forEach((history) => {
      console.log('history: ', history.values);
    });
  }, [histories]);

  // useEffect(() => {
  //   const assetSum = reduce(assets, (sum, asset) => sum + asset.value, 0);
  //   const debtSum = reduce(debts, (sum, debt) => sum + debt.amount, 0);
  //   setNetworth(assetSum - debtSum);
  // }, [assets, debts]);

  // useEffect(() => {
  //   const today = dayjs();
  //   const lastMonth = today.subtract(1, 'month');
  //   const lastMonthNetworth = find(networths, {
  //     year: lastMonth.year(),
  //     month: lastMonth.month() + 1,
  //   });

  //   if (!lastMonthNetworth) {
  //     return;
  //   }

  //   const assetSum = reduce(
  //     lastMonthNetworth.assets,
  //     (sum, asset) => sum + asset.value,
  //     0
  //   );
  //   const debtSum = reduce(
  //     lastMonthNetworth.debts,
  //     (sum, debt) => sum + debt.value,
  //     0
  //   );
  //   const net = assetSum - debtSum;
  //   setDifference(networth - net);
  // }, [networths, networth]);

  // const differenceAttrs = (() => {
  //   if (difference === 0) {
  //     return { color: 'text.secondary', symbol: null };
  //   }
  //   if (difference > 0) {
  //     return { color: 'success.main', symbol: '+' };
  //   }
  //   return { color: 'error.main', symbol: '-' };
  // })();

  const percentDifference = (() => {
    if (networth === 0) {
      return 0;
    }
    return (difference / networth) * 100;
  })();

  return (
    <Grid item xs={12} mt={2}>
      <Box
        sx={{
          backgroundColor: 'surface.250',
          borderRadius: 1,
          px: 2,
          py: 1,
          boxShadow: (theme) => theme.shadows[4],
        }}
      >
        <Typography
          variant='body1'
          fontWeight='bold'
          color='text.secondary'
          sx={{ py: 1 }}
        >
          NET WORTH
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          <Typography variant='h5' fontWeight='bold'>
            {numberToCurrency.format(networth)}
          </Typography>
          <Icon sx={{ color: differenceAttrs.color, mb: 0.5, ml: 1 }}>
            {difference >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
          </Icon>
          <Typography
            variant='body1'
            fontWeight='bold'
            sx={{ color: differenceAttrs.color, mb: 0.25 }}
          >
            {numberToCurrency.format(Math.abs(difference))} (
            {percentDifference.toFixed(2)}%)
          </Typography>
          <Typography
            variant='body2'
            fontWeight='bold'
            color='text.secondary'
            sx={{ mb: 0.25 }}
          >
            PAST MONTH
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant='body2'>
          Past 30 Days Net Worth & percent change
        </Typography>
      </Box>
    </Grid>
  );
}
