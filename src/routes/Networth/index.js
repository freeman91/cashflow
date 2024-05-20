import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
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
} from 'recharts';

import { numberToCurrency } from '../../helpers/currency';
import SelectedMonth from './SelectedMonth';

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const networth = find(payload, (p) => p.dataKey === 'networth');
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
            <Typography>{numberToCurrency.format(networth.value)}</Typography>
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
  const [range, setRange] = useState({
    start: { month: 1, year: 2018 },
    end: { month: 1, year: 2030 },
  });

  useEffect(() => {
    if (allNetworths.length) {
      const firstMonthData = allNetworths[0];
      const lastMonthData = allNetworths[allNetworths.length - 1];

      let firstMonth = dayjs(
        `${firstMonthData.year}-${firstMonthData.month}-01`
      );
      let lastMonth = dayjs(`${lastMonthData.year}-${lastMonthData.month}-01`);

      firstMonth = firstMonth.subtract(1, 'month');
      lastMonth = lastMonth.add(1, 'month');

      setRange({
        start: { month: firstMonth.month(), year: firstMonth.year() },
        end: { month: lastMonth.month(), year: lastMonth.year() },
      });
    }

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
        negDebtSum: debtSum,
        debtSum: -1 * debtSum,
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
          <ResponsiveContainer
            width='100%'
            height={350}
            style={{ '& .recharts-surface': { overflow: 'visible' } }}
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
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis
                type='number'
                tickMargin={10}
                dataKey='timestamp'
                domain={[
                  dayjs()
                    .year(range.start.year)
                    .month(range.start.month)
                    .date(1)
                    .unix() * 1000,
                  dayjs()
                    .year(range.end.year)
                    .month(range.end.month)
                    .date(1)
                    .unix() * 1000,
                ]}
                tickFormatter={(unixTime) => {
                  return dayjs(unixTime).format('MMM YYYY');
                }}
              />

              <Tooltip content={<ChartTooltip />} />

              <Bar
                dataKey='debtSum'
                fill={red[400]}
                barSize={8}
                stackId='stack'
              />
              <Bar
                dataKey='negDebtSum'
                fill='transparent'
                barSize={8}
                stackId='stack'
              />

              <Bar
                dataKey='assetSum'
                fill={green[400]}
                barSize={8}
                stackId='stack'
              />

              <Line
                dot={false}
                type='monotone'
                dataKey='networth'
                stroke={blue[200]}
                strokeWidth={3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12}>
          <SelectedMonth selected={selected} />
        </Grid>
      </Grid>
    </>
  );
}
