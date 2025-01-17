import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { findAmount } from '../../helpers/transactions';
import { ASSET, LIABILITY } from '../../components/Forms/AccountForm';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'surface.300',
          borderRadius: 1,
          boxShadow: (theme) => theme.shadows[8],
          px: 2,
          py: 0.5,
        }}
      >
        <Typography variant='body1' align='center'>
          {dayjs.unix(Number(label)).format('MMM Do')}
        </Typography>
        <Typography variant='body1' fontWeight='bold' align='center'>
          {numberToCurrency.format(payload[0].value)}
        </Typography>
      </Box>
    );
  }
  return null;
}

export default function NetWorth() {
  const theme = useTheme();
  const histories = useSelector((state) => state.histories.data);
  const accounts = useSelector((state) => state.accounts.data);

  const [networth, setNetworth] = useState(0);
  const [assetAccounts, setAssetAccounts] = useState([]);
  const [liabilityAccounts, setLiabilityAccounts] = useState([]);
  const [days, setDays] = useState([]);
  const [difference, setDifference] = useState(0);

  useEffect(() => {
    const assetAccounts = filter(accounts, { account_type: ASSET });
    const liabilityAccounts = filter(accounts, { account_type: LIABILITY });
    setAssetAccounts(assetAccounts);
    setLiabilityAccounts(liabilityAccounts);
  }, [accounts]);

  useEffect(() => {
    const assetSum = reduce(
      assetAccounts,
      (sum, account) => sum + findAmount(account),
      0
    );
    const liabilitySum = reduce(
      liabilityAccounts,
      (sum, account) => sum + findAmount(account),
      0
    );

    setNetworth(assetSum - liabilitySum);
  }, [assetAccounts, liabilityAccounts]);

  useEffect(() => {
    const firstDay = find(days, (day) => day.networth !== null);
    if (firstDay) {
      const diff = networth - firstDay.networth;
      setDifference(diff);
    }
  }, [days, networth]);

  useEffect(() => {
    const today = dayjs();
    const start = dayjs().subtract(6, 'month');
    let _days = [];
    let currentDay = start;

    while (currentDay <= today) {
      const date = currentDay.set('hour', 12).set('minute', 0).set('second', 0);
      let dayAssets = 0;
      let dayLiabilities = 0;

      // get all histories for the day
      const historiesForMonth = filter(histories, (history) => {
        return (
          history.month === date.format('YYYY-MM') &&
          history.item_id.startsWith('account')
        );
      });
      for (const history of historiesForMonth) {
        // find date in value
        let valueItem = find(history.values, {
          date: date.format('YYYY-MM-DD'),
        });
        if (valueItem) {
          if (history.account_type === ASSET) {
            dayAssets += valueItem.value;
          } else {
            dayLiabilities += valueItem.value;
          }
        }
      }

      let networth = dayAssets - dayLiabilities;
      if (networth !== 0) {
        _days.push({
          timestamp: date.unix(),
          networth,
        });
      }

      currentDay = currentDay.add(1, 'day');
    }

    setDays(_days);
  }, [histories]);

  const differenceAttrs = (() => {
    if (difference === 0) {
      return { color: 'textSecondary', symbol: null };
    }
    if (difference > 0) {
      return { color: 'success.main', symbol: '+' };
    }
    return { color: 'error.main', symbol: '-' };
  })();

  const percentDifference = (() => {
    if (networth === 0) {
      return 0;
    }
    return (difference / networth) * 100;
  })();

  return (
    <Grid size={{ xs: 12 }} display='flex' justifyContent='center'>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          px: 1,
          py: 0.5,
          width: '100%',
        }}
      >
        <Typography
          variant='body1'
          fontWeight='bold'
          color='textSecondary'
          sx={{ mt: 1, mx: 1 }}
        >
          NET WORTH
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            gap: 1,
            mx: 1,
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
            color='textSecondary'
            sx={{ mb: 0.25, display: { xs: 'none', md: 'block' } }}
          >
            PAST 6 MONTHS
          </Typography>
        </Box>
        <ResponsiveContainer
          width='100%'
          height={200}
          style={{ '& .rechartsSurface': { overflow: 'visible' } }}
        >
          <AreaChart
            width='100%'
            height={200}
            data={days}
            margin={{
              top: 2,
              right: 2,
              left: 2,
              bottom: 0,
            }}
          >
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <XAxis
              axisLine={false}
              tickLine={false}
              type='number'
              dataKey='timestamp'
              domain={['dataMin', 'dataMax']}
              // ticks={ticks}
              tickFormatter={(value) => {
                return dayjs.unix(value).format('MMM Do');
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Area
              dot={false}
              type='monotone'
              dataKey='networth'
              stroke={theme.palette.success.main}
              fill={alpha(theme.palette.success.main, 0.2)}
              strokeWidth={2}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
