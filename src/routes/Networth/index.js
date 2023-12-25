import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import dayjs from 'dayjs';

import { useTheme } from '@mui/styles';
import { blue } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { numberToCurrency } from '../../helpers/currency';

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
        networth: assetSum - debtSum,
      };
    });
    setChartData(_data);
  }, [allNetworths]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Grid item xs={12}>
          <Card
            raised
            sx={{
              width: '100%',
            }}
          >
            {/* <CardHeader
            title='over time'
            action={
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={1}
              >
                <IconButton onClick={() => {}}>
                  <CalendarMonthIcon />
                </IconButton>
                <IconButton onClick={() => {}}>
                  <FilterListIcon />
                </IconButton>
              </Stack>
            }
            titleTypographyProps={{ align: 'left' }}
          /> */}
            <CardContent>
              <ResponsiveContainer
                width={'100%'}
                height={400}
                style={{
                  '& .recharts-surface': {
                    overflow: 'visible',
                  },
                }}
              >
                <LineChart
                  width='100%'
                  height={400}
                  data={chartData}
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
                  />
                  <XAxis
                    type='number'
                    tickMargin={10}
                    dataKey='timestamp'
                    domain={[
                      dayjs().year(2023).month(9).date(1).unix() * 1000,
                      dayjs().year(2023).month(11).date(25).unix() * 1000,
                    ]}
                    tickFormatter={(unixTime) => {
                      return dayjs(unixTime).format('YYYY MMM');
                    }}
                  />

                  <Tooltip content={<ChartTooltip />} />

                  <Line
                    dot={false}
                    type='monotone'
                    dataKey='networth'
                    stroke={blue[400]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
