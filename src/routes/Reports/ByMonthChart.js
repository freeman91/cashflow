import React from 'react';
import dayjs from 'dayjs';
import get from 'lodash/get';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import {
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import useMonthlyReportChartData from '../../store/hooks/useMonthlyReportChartData';
import { numberToCurrency } from '../../helpers/currency';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const date = dayjs(label, 'YYYY-MM');

    const income = get(payload, '[0].value', 0);
    const expense = get(payload, '[1].value', 0);
    const net = get(payload, '[2].value', 0);

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
          {date.format('MMMM YYYY')}
        </Typography>
        <Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Typography variant='body1' align='center'>
              Income
            </Typography>
            <Typography variant='body1' align='center'>
              {numberToCurrency.format(income)}
            </Typography>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Typography variant='body1' align='center'>
              Expense
            </Typography>
            <Typography variant='body1' align='center'>
              {numberToCurrency.format(expense)}
            </Typography>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Typography variant='body1' align='center'>
              Net
            </Typography>
            <Typography variant='body1' align='center'>
              {numberToCurrency.format(net)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
  return null;
}

export default function ByMonthChart(props) {
  const { year, month } = props;
  const theme = useTheme();
  const { chartData } = useMonthlyReportChartData(year, month);

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <ResponsiveContainer
            width='100%'
            height={200}
            style={{ '& .rechartsSurface': { overflow: 'visible' } }}
          >
            <ComposedChart
              width='100%'
              height={200}
              data={chartData}
              stackOffset='sign'
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
                dataKey='month'
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => {
                  const date = dayjs(value, 'YYYY-MM');
                  return date.format('MMM YYYY');
                }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Bar
                stackId='a'
                dataKey='income'
                fill={theme.palette.success.main}
                stroke='transparent'
                radius={[5, 5, 0, 0]}
                barSize={40}
              />
              <Bar
                stackId='a'
                dataKey='expense'
                fill={theme.palette.error.main}
                stroke='transparent'
                radius={[5, 5, 0, 0]}
                barSize={40}
              />
              <Line
                dot={false}
                type='monotone'
                dataKey='net'
                stroke={theme.chartColors[8]}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Grid>
  );
}
