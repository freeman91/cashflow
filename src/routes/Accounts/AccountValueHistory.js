import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import filter from 'lodash/filter';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import LoopIcon from '@mui/icons-material/Loop';
import EditIcon from '@mui/icons-material/Edit';
import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { findAmount } from '../../helpers/transactions';
import { ASSET, LIABILITY } from '../../components/Forms/AccountForm';
import { openItemView } from '../../store/itemView';

function CustomTooltip({ active, payload, label }) {
  const securities = useSelector((state) => state.securities.data);

  if (active && payload && payload.length) {
    const accountPayload = payload.find((p) => p.dataKey === 'accountValue');
    let securityPayloads = payload.filter((p) =>
      p.dataKey.startsWith('security')
    );

    return (
      <Box
        sx={{
          bgcolor: 'surface.300',
          borderRadius: 1,
          boxShadow: (theme) => theme.shadows[8],
          px: 1,
          py: 0.5,
        }}
      >
        <Typography variant='body1' align='center'>
          {dayjs.unix(Number(label)).format('MMM Do')}
        </Typography>
        {accountPayload && (
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Typography variant='body1' align='left' color='textSecondary'>
              Account
            </Typography>
            <Typography variant='body1' fontWeight='bold' align='right'>
              {numberToCurrency.format(accountPayload.value)}
            </Typography>
          </Box>
        )}
        {securityPayloads.map((p) => {
          const security = securities.find((s) => s.security_id === p.dataKey);
          return (
            <Box
              key={security.security_id}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant='body1' align='left' color='textSecondary'>
                {security.ticker}
              </Typography>
              <Typography variant='body1' fontWeight='bold' align='right'>
                {numberToCurrency.format(p.value)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }
  return null;
}

export default function AccountValueHistory(props) {
  const { account } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  let accountValue = findAmount(account);
  if (account.account_type === LIABILITY && accountValue > 0) {
    accountValue = -accountValue;
  }

  const securities = useSelector((state) => state.securities.data);
  const histories = useSelector((state) => state.histories.data);
  const [days, setDays] = useState([]);
  const [difference, setDifference] = useState(0);

  useEffect(() => {
    const firstDay = find(days, (day) => day.accountValue !== null);
    if (firstDay) {
      const diff = accountValue - firstDay.accountValue;
      setDifference(diff);
    }
  }, [days, accountValue]);

  useEffect(() => {
    const today = dayjs();
    const start = dayjs().subtract(6, 'month');
    let _days = [];
    let currentDay = start;
    const accountSecurityIds = securities
      .filter((s) => s.account_id === account.account_id)
      .map((security) => security.security_id);

    while (currentDay <= today) {
      const date = currentDay.set('hour', 12).set('minute', 0).set('second', 0);
      let dayObj = { timestamp: date.unix() };

      // get all histories for the day
      const monthHistories = filter(histories, (history) => {
        return history.month === date.format('YYYY-MM');
      });
      const monthAccountHistory = find(monthHistories, (history) => {
        return history.item_id === account.account_id;
      });
      let valueItem = find(monthAccountHistory?.values, {
        date: date.format('YYYY-MM-DD'),
      });
      if (valueItem) {
        if (account.account_type === ASSET) {
          dayObj.accountValue = valueItem.value;
        } else {
          dayObj.accountValue = -valueItem.value;
        }
      }
      const monthSecurityHistories = filter(monthHistories, (history) => {
        return accountSecurityIds.includes(history.item_id);
      });
      for (const history of monthSecurityHistories) {
        let valueItem = find(history.values, {
          date: date.format('YYYY-MM-DD'),
        });
        if (valueItem) {
          dayObj[history.item_id] = valueItem.value;
        }
      }
      _days.push(dayObj);
      currentDay = currentDay.add(1, 'day');
    }
    // filter out days where only timestamp is present
    _days = filter(_days, (day) => {
      return Object.keys(day).length > 1;
    });
    setDays(_days);
  }, [histories, account, securities]);

  const openAccountDialog = () => {
    dispatch(
      openItemView({
        itemType: 'account',
        mode: 'edit',
        attrs: account,
      })
    );
  };

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
    if (accountValue === 0) {
      return 0;
    }
    return (difference / accountValue) * 100;
  })();

  return (
    <Grid size={{ xs: 12 }} display='flex' justifyContent='center'>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          px: 2,
          py: 0.5,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant='body1' fontWeight='bold' color='textSecondary'>
            VALUE HISTORY
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isMobile ? (
              <IconButton>
                <LoopIcon />
              </IconButton>
            ) : (
              <Button variant='outlined' startIcon={<LoopIcon />}>
                Refresh
              </Button>
            )}
            {isMobile ? (
              <IconButton onClick={openAccountDialog}>
                <EditIcon />
              </IconButton>
            ) : (
              <Button
                variant='contained'
                startIcon={<EditIcon />}
                onClick={openAccountDialog}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          <Typography variant='h5' fontWeight='bold'>
            {numberToCurrency.format(accountValue)}
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
          style={{ '& .recharts-surface': { overflow: 'visible' } }}
        >
          <AreaChart
            width='100%'
            height={200}
            data={days}
            margin={{
              top: 5,
              right: 5,
              left: 5,
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
              tickFormatter={(value) => {
                return dayjs.unix(value).format('MMM Do');
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Area
              dot={false}
              type='monotone'
              dataKey='accountValue'
              stroke={theme.palette.success.main}
              fill={alpha(theme.palette.success.main, 0.2)}
              strokeWidth={2}
              connectNulls
            />
            {securities.map((security) => {
              return (
                <Area
                  key={security.security_id}
                  dot={false}
                  type='monotone'
                  dataKey={security.security_id}
                  stroke={theme.palette.primary.main}
                  fill={alpha(theme.palette.primary.main, 0.2)}
                  strokeWidth={2}
                  connectNulls
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
