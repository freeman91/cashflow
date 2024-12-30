import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import _range from 'lodash/range';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { _numberToCurrency } from '../../../../helpers/currency';
import BoxFlexCenter from '../../../../components/BoxFlexCenter';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const net = payload.find((item) => item.name === 'net');
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
        <Typography variant='h6' align='center'>
          {label}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='body1' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h6' fontWeight='bold'>
            {_numberToCurrency.format(net.value)}
          </Typography>
        </BoxFlexCenter>
      </Box>
    );
  }
  return null;
}

const compileData = (incomeSumByMonth, expenseSumByMonth) => {
  return _range(12)
    .map((month) => ({
      name: dayjs().month(month).format('MMMM'),
      income: incomeSumByMonth[month],
      resetIncome: -incomeSumByMonth[month],
      expense: -expenseSumByMonth[month],
      resetExpense: expenseSumByMonth[month],
      net: incomeSumByMonth[month] - expenseSumByMonth[month],
    }))
    .filter((item) => item.net !== 0);
};

export default function MonthlyLineChart(props) {
  const { incomeSumByMonth, expenseSumByMonth } = props;
  const theme = useTheme();
  const componentRef = useRef(null);

  const [chartData, setChartData] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setChartData(compileData(incomeSumByMonth, expenseSumByMonth));
  }, [incomeSumByMonth, expenseSumByMonth]);

  useEffect(() => {
    if (componentRef.current) {
      setWidth(componentRef.current.offsetWidth);
      setHeight(componentRef.current.offsetHeight);
    }
  }, [componentRef]);

  return (
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box ref={componentRef} sx={{ height: 157, width: '100%' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart
            width={width}
            height={height}
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <XAxis
              dataKey='name'
              axisLine={false}
              tickLine={false}
              tickFormatter={(monthName) => {
                return monthName[0];
              }}
            />
            <YAxis hide />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Bar
              stackId='a'
              dataKey='income'
              fill={theme.palette.success.main}
              barSize={15}
            />
            <Bar stackId='a' dataKey='resetIncome' fill='transparent' />
            <Bar
              stackId='a'
              dataKey='expense'
              fill={theme.palette.error.main}
              barSize={15}
            />
            <Bar stackId='a' dataKey='resetExpense' fill='transparent' />
            <Line
              dot={false}
              type='monotone'
              dataKey='net'
              stroke={theme.palette.primary.main}
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
