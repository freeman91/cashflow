import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { numberToCurrency } from '../../../helpers/currency';

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const income = payload.find((item) => item.name === 'income');
    const expense = payload.find((item) => item.name === 'expense');
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
        <List disablePadding sx={{ pb: '0 !important' }}>
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              align: 'center',
              color: 'text.secondary',
            }}
          />
          <ListItemText
            primary={numberToCurrency.format(net.value)}
            primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
            secondary='net'
            secondaryTypographyProps={{ align: 'left' }}
          />
          <ListItemText
            primary={numberToCurrency.format(income.value)}
            primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
            secondary='income'
            secondaryTypographyProps={{ align: 'left' }}
          />
          <ListItemText
            primary={numberToCurrency.format(expense.value)}
            primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
            secondary='expense'
            secondaryTypographyProps={{ align: 'left' }}
          />
        </List>
      </Box>
    );
  }
  return null;
}

const compileData = (incomeSumByMonth, expenseSumByMonth) => {
  return MONTH_NAMES.map((month, index) => ({
    name: month,
    income: incomeSumByMonth[index],
    resetIncome: -incomeSumByMonth[index],
    expense: -expenseSumByMonth[index],
    resetExpense: expenseSumByMonth[index],
    net: incomeSumByMonth[index] - expenseSumByMonth[index],
  })).filter((item) => item.net !== 0);
};

export default function MonthlyLineChart(props) {
  const { incomeSumByMonth, expenseSumByMonth } = props;
  const theme = useTheme();
  const componentRef = useRef(null);

  const [chartData, setChartData] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (componentRef.current) {
      setWidth(componentRef.current.offsetWidth);
      setHeight(componentRef.current.offsetHeight);
    }
  }, [componentRef]);

  useEffect(() => {
    setChartData(compileData(incomeSumByMonth, expenseSumByMonth));
  }, [incomeSumByMonth, expenseSumByMonth]);

  return (
    <Grid item xs={12}>
      <Box ref={componentRef} sx={{ height: 200 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={width}
            height={height}
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              bottom: 5,
              left: 5,
            }}
          >
            <XAxis dataKey='name' axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Bar stackId='a' dataKey='income' fill={theme.palette.green[400]} />
            <Bar stackId='a' dataKey='resetIncome' fill='transparent' />
            <Bar stackId='a' dataKey='expense' fill={theme.palette.red[400]} />
            <Bar stackId='a' dataKey='resetExpense' fill='transparent' />
            <Bar
              stackId='a'
              dataKey='net'
              fill='#0763c2'
              barSize={5}
              maxBarSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
