import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';

import { useTheme } from '@mui/styles';
import { blue, green, red } from '@mui/material/colors';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { numberToCurrency } from '../../helpers/currency';
import SelectedMonth from './SelectedMonth';

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 0 }}>
        <CardContent sx={{ p: 1, pb: '4px !important' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: 200,
            }}
          >
            <Typography>{dayjs(Number(label)).format('MMM, YYYY')}</Typography>
            <Typography>{numberToCurrency.format(payload[0].value)}</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
  return null;
}

export default function Networth() {
  const theme = useTheme();
  const allNetworths = useSelector((state) => state.networths.data);
  const [selected, setSelected] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let _data = map(allNetworths, (networth) => {
      const assetSum = reduce(
        networth.assets,
        (sum, asset) => sum + asset.value,
        0
      );
      const debtSum = reduce(
        networth.debts,
        (sum, debt) => sum + debt.value,
        0
      );

      return {
        timestamp: dayjs(networth.date).date(15).unix() * 1000,
        assetSum,
        debtSum: -debtSum,
        networth: assetSum - debtSum,
        id: networth.networth_id,
      };
    });
    _data = sortBy(_data, 'timestamp');
    setChartData(_data);
  }, [allNetworths]);

  return (
    <>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Grid item xs={12}>
          <Card raised sx={{ width: '100%' }}>
            <CardContent sx={{ pl: 0, pt: 1, pb: '8px !important' }}>
              <ResponsiveContainer
                width={'100%'}
                height={400}
                style={{
                  '& .recharts-surface': {
                    overflow: 'visible',
                  },
                }}
              >
                <ComposedChart
                  width='100%'
                  height={400}
                  data={chartData}
                  onClick={(e) => {
                    if (e?.activeTooltipIndex) {
                      setSelected(chartData[e.activeTooltipIndex]);
                    } else {
                      setSelected({});
                    }
                  }}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <YAxis
                    tickFormatter={(val, _axis) => {
                      return numberToCurrency
                        .format(val)
                        .replace(',000.00', ' k');
                    }}
                    domain={[-25000, 350000]}
                  />
                  <XAxis
                    type='number'
                    tickMargin={10}
                    dataKey='timestamp'
                    domain={[
                      dayjs().year(2018).month(9).date(1).unix() * 1000,
                      dayjs().year(2024).month(1).date(1).unix() * 1000,
                    ]}
                    tickFormatter={(unixTime) => {
                      return dayjs(unixTime).format('MMM YYYY');
                    }}
                  />

                  <Tooltip content={<ChartTooltip />} />

                  <Line
                    dot={false}
                    type='monotone'
                    dataKey='networth'
                    stroke={blue[400]}
                  />
                  <Bar dataKey='assetSum' fill={green[400]} stackId='stack' />
                  <Bar dataKey='debtSum' fill={red[400]} stackId='stack' />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <SelectedMonth selected={selected} />
        </Grid>
      </Grid>
    </>
  );
}
