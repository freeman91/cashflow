import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SelectRangeChipStack from '../../components/SelectRangeChipStack';

const numberToCurrency = (value) => {
  let _value = Math.abs(value);
  if (_value < 1)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(_value);
  else if (_value < 100)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(_value);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const BoxMonthValue = (props) => {
  const { label, payload } = props;
  const net = payload.find((item) => item.name === 'net');

  return (
    <Card sx={{ p: 1 }}>
      <List disablePadding>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontWeight: 'bold', align: 'center' }}
        />
        <ListItemText
          primary={'$' + numberToCurrency(net.value)}
          primaryTypographyProps={{ align: 'center' }}
        />
      </List>
    </Card>
  );
};

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <BoxMonthValue
        label={dayjs.unix(Number(label)).format('MMMM YYYY')}
        payload={payload}
      />
    );
  }
  return null;
}

export default function AccountChart(props) {
  const { account } = props;
  const theme = useTheme();

  const allNetworths = useSelector((state) => state.networths.data);
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState({
    start: { month: 10, year: 2018 },
    end: { month: 1, year: 2030 },
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

        const networthAssets = filter(networth.assets, {
          account_id: account.account_id,
        });
        const networthDebts = filter(networth.debts, {
          account_id: account.account_id,
        });

        let assets = {};
        let debts = {};
        for (const asset of networthAssets) {
          assets[asset.asset_id] = asset.value;
        }
        for (const debt of networthDebts) {
          debts[debt.debt_id] = debt.value * -1;
        }
        if (networthAssets.length > 0 || networthDebts.length > 0) {
          let net = 0;
          for (const asset of networthAssets) {
            net += asset.value;
          }
          for (const debt of networthDebts) {
            net -= debt.value;
          }

          return [
            ...acc,
            {
              timestamp: dayjs(networth.date).date(15).unix(),
              ...assets,
              ...debts,
              net,
            },
          ];
        } else {
          return acc;
        }
      },
      []
    );
    setChartData(sortBy(_data, 'timestamp'));
  }, [account, allNetworths, range]);

  const sortedSelected = Object.keys(selected || {})
    .sort((a, b) => {
      return selected[a] - selected[b];
    })
    .reverse();

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.net));
    const dataMin = Math.min(...chartData.map((i) => i.net));

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
    <Grid item xs={12} display='flex' justifyContent='center'>
      <Box sx={{ width: '100%', px: 1 }}>
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
              right: 5,
              left: 5,
              bottom: 0,
            }}
          >
            <YAxis hide type='number' domain={['auto', 'auto']} />
            <XAxis
              hide
              axisLine={false}
              tickLine={false}
              type='number'
              dataKey='timestamp'
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip content={<ChartTooltip />} />
            <defs>
              <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor={theme.palette.success.main}
                  stopOpacity={1}
                />
                <stop
                  offset={off}
                  stopColor={theme.palette.success.main}
                  stopOpacity={0.3}
                />
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
              dataKey='net'
              stroke='url(#splitColor)'
              fill='url(#splitColor)'
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <SelectRangeChipStack setRange={setRange} />
        {selected && (
          <Card sx={{ pt: 1, mt: 1 }}>
            <List disablePadding>
              <ListItem
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <ListItemText
                  primary={dayjs
                    .unix(Number(selected.timestamp))
                    .format('MMMM YYYY')}
                  primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
                />
                <ListItemText
                  primary={'$' + numberToCurrency(selected.net)}
                  primaryTypographyProps={{ align: 'right' }}
                />
              </ListItem>
              <Divider sx={{ mx: 1 }} />
              {map(sortedSelected, (id) => {
                if (id === 'timestamp' || id === 'net') {
                  return null;
                }

                let item = {};
                if (id.startsWith('asset')) {
                  item = find(assets, { asset_id: id });
                } else if (id.startsWith('debt')) {
                  item = find(debts, { debt_id: id });
                }
                let value = selected[id];
                return (
                  <ListItem
                    key={id}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <ListItemText secondary={item.name || id} />
                    <ListItemText
                      primary={'$' + numberToCurrency(value)}
                      primaryTypographyProps={{ align: 'right' }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Card>
        )}
      </Box>
    </Grid>
  );
}
