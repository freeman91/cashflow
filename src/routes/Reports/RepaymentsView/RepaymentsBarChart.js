import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import range from 'lodash/range';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { numberToCurrency } from '../../../helpers/currency';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const date = dayjs.unix(label).format('MMM YYYY');

    const _payload = cloneDeep(payload);

    const total = _payload.reduce((acc, item) => acc + item.value, 0);
    return (
      <List
        disablePadding
        sx={{
          bgcolor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[24],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          py: 0.5,
        }}
      >
        <ListItemText
          primary={date}
          slotProps={{ primary: { align: 'center', variant: 'h6' } }}
        />
        {_payload.reverse().map((item) => {
          return (
            <ListItem
              key={item.name}
              sx={{ display: 'flex', gap: 1, px: 1, py: 0 }}
            >
              <Box sx={{ height: 10, width: 10, bgcolor: item.color }} />
              <ListItemText secondary={item.name} />
              <ListItemText
                primary={numberToCurrency.format(item.value)}
                slotProps={{
                  primary: { align: 'right' },
                }}
              />
            </ListItem>
          );
        })}
        <Divider sx={{ width: '100%', my: 0.5 }} />
        <ListItemText
          primary={numberToCurrency.format(total)}
          slotProps={{ primary: { align: 'center' } }}
        />
      </List>
    );
  }
  return null;
}

export default function RepaymentsBarChart(props) {
  const { date } = props;
  const theme = useTheme();
  const allRepayments = useSelector((state) => state.repayments.data);

  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    let _chartData = [];
    let currMonth = date.date(15);
    range(12).forEach((idx) => {
      const repayments = allRepayments.filter((repayment) => {
        const repaymentDate = dayjs(repayment.date);
        return (
          repaymentDate.isSame(currMonth, 'month') &&
          !get(repayment, 'pending', false)
        );
      });
      const principal = repayments.reduce(
        (acc, repayment) => acc + repayment.principal,
        0
      );
      const interest = repayments.reduce(
        (acc, repayment) => acc + repayment.interest,
        0
      );
      const escrow = repayments.reduce(
        (acc, repayment) => acc + get(repayment, 'escrow', 0),
        0
      );
      _chartData.push({
        month: currMonth.unix(),
        principal,
        interest,
        escrow,
      });
      currMonth = currMonth.subtract(1, 'month');
    });
    setChartData(_chartData.reverse());
  }, [allRepayments, date]);

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          pt: 1,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <ResponsiveContainer
            width='100%'
            height={200}
            style={{ '& .rechartsSurface': { overflow: 'visible' } }}
          >
            <BarChart
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
                  return dayjs.unix(value).format('MMM YYYY');
                }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Bar
                stackId='a'
                dataKey='principal'
                fill={theme.palette.red[300]}
                stroke='transparent'
                radius={[3, 3, 3, 3]}
                barSize={40}
              />
              <Bar
                stackId='a'
                dataKey='interest'
                fill={theme.palette.error.main}
                stroke='transparent'
                radius={[3, 3, 3, 3]}
                barSize={40}
              />
              <Bar
                stackId='a'
                dataKey='escrow'
                fill={theme.palette.orange.main}
                stroke='transparent'
                radius={[3, 3, 3, 3]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Grid>
  );
}
