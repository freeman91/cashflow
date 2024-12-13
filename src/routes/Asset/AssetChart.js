import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Card from '@mui/material/Card';
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

import { numberToCurrency } from '../../helpers/currency';
import SubaccountHistoryTooltip from '../../components/SubaccountHistoryTooltip';
import SelectRangeChipStack from '../../components/SelectRangeChipStack';

export default function AssetChart(props) {
  const { asset } = props;
  const today = dayjs();
  const theme = useTheme();
  const allNetworths = useSelector((state) => state.networths.data);
  const allAccounts = useSelector((state) => state.accounts.data);

  const [account, setAccount] = useState(null);
  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState({
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
        const assetValue = find(networth.assets, { asset_id: asset.asset_id });
        if (assetValue) {
          return [
            ...acc,
            {
              timestamp: dayjs(networth.date).date(15).unix(),
              ...assetValue,
            },
          ];
        } else {
          return acc;
        }
      },
      []
    );
    setChartData(sortBy(_data, 'timestamp'));
  }, [allNetworths, asset, range]);

  useEffect(() => {
    if (selected?.account_id) {
      setAccount(find(allAccounts, { account_id: selected.account_id }));
    }
  }, [selected, allAccounts]);

  return (
    <>
      <Grid item xs={12} mx={1}>
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
            <YAxis hide type='number' domain={['auto', 'auto']} />
            <XAxis
              hide
              axisLine={false}
              tickLine={false}
              type='number'
              dataKey='timestamp'
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip content={<SubaccountHistoryTooltip />} />
            <defs>
              <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor={theme.palette.success.main}
                  stopOpacity={0.8}
                />
                <stop
                  offset={0.8}
                  stopColor={theme.palette.success.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dot={false}
              type='monotone'
              dataKey='value'
              stroke={theme.palette.success.main}
              fill='url(#splitColor)'
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={12} mx={1}>
        <SelectRangeChipStack setRange={setRange} />
      </Grid>
      {selected && (
        <Grid item xs={12} mx={1}>
          <Card>
            <List disablePadding>
              <ListItemText
                primary={dayjs
                  .unix(Number(selected.timestamp))
                  .format('MMMM YYYY')}
                primaryTypographyProps={{
                  align: 'center',
                  color: 'text.secondary',
                  sx: { pt: 1 },
                }}
              />
              <ListItem
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
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
        </Grid>
      )}
    </>
  );
}
