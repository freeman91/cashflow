import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { numberToCurrency } from '../../helpers/currency';
import SubaccountHistoryTooltip from '../Home/Accounts/SubaccountHistoryTooltip';

export default function DebtChart(props) {
  const { debt } = props;
  const today = dayjs();
  const theme = useTheme();
  const allNetworths = useSelector((state) => state.networths.data);
  const allAccounts = useSelector((state) => state.accounts.data);

  const [account, setAccount] = useState(null);
  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range] = useState({
    start: { month: today.month(), year: today.subtract(2, 'year').year() },
    end: {
      month: today.month(),
      year: today.year(),
    },
  });

  useEffect(() => {
    let _data = reduce(
      allNetworths,
      (acc, networth) => {
        const networthDate = dayjs(networth.date);
        const rangeStart = dayjs()
          .year(range.start.year)
          .month(range.start.month)
          .date(1);
        if (networthDate.isBefore(rangeStart)) {
          return acc;
        }

        const debtValue = find(networth.debts, { debt_id: debt.debt_id });
        const value = debtValue?.value ? debtValue.value * -1 : 0;

        if (debtValue) {
          return [
            ...acc,
            {
              timestamp: dayjs(networth.date).date(15).unix(),
              ...debtValue,
              value,
            },
          ];
        } else {
          return acc;
        }
      },
      []
    );
    setChartData(sortBy(_data, 'timestamp'));
  }, [allNetworths, debt, range]);

  useEffect(() => {
    if (selected?.account_id) {
      setAccount(find(allAccounts, { account_id: selected.account_id }));
    }
  }, [selected, allAccounts]);

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.value));
    const dataMin = Math.min(...chartData.map((i) => i.value));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <Box sx={{ p: 1, maxWidth: 500, width: '100%' }}>
      <ResponsiveContainer
        width='100%'
        height={200}
        style={{ '& .recharts-surface': { overflow: 'visible' } }}
      >
        <AreaChart
          width='100%'
          height={200}
          data={chartData}
          onClick={(e) => {
            if (!isNull(e?.activeTooltipIndex)) {
              setSelected(chartData[e.activeTooltipIndex]);
            } else {
              setSelected(null);
            }
          }}
          margin={{
            top: 0,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis
            hide
            axisLine={false}
            tickLine={false}
            type='number'
            dataKey='timestamp'
            domain={[
              dayjs()
                .year(range.start.year)
                .month(range.start.month)
                .date(1)
                .unix(),
              dayjs()
                .year(range.end.year)
                .month(range.end.month)
                .date(1)
                .unix(),
            ]}
          />
          <Tooltip content={<SubaccountHistoryTooltip />} />
          <defs>
            <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset={off}
                stopColor={theme.palette.error.main}
                stopOpacity={0.3}
              />
              <stop
                offset='100%'
                stopColor={theme.palette.error.main}
                stopOpacity={1}
              />
            </linearGradient>
          </defs>
          <Area
            dot={false}
            type='monotone'
            dataKey='value'
            stroke='url(#splitColor)'
            fill='url(#splitColor)'
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      {selected && (
        <Card sx={{ mt: 1 }}>
          <List disablePadding>
            <ListItemText
              primary={dayjs
                .unix(Number(selected.timestamp))
                .format('MMMM YYYY')}
              primaryTypographyProps={{
                align: 'center',
                color: 'text.secondary',
              }}
            />
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={account?.name} secondary='account' />
              <ListItemText
                primary={numberToCurrency.format(selected.value)}
                primaryTypographyProps={{
                  align: 'right',
                  fontWeight: 'bold',
                }}
              />
            </ListItem>
          </List>
        </Card>
      )}
    </Box>
  );
}
