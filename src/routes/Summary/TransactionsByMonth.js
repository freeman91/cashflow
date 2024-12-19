import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import head from 'lodash/head';
import range from 'lodash/range';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { findAmount } from '../../helpers/transactions';
import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const value = head(payload).value || 0;
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
            {_numberToCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </Box>
    );
  }
  return null;
}

export default function TransactionsByMonth(props) {
  const { year, transactions, color } = props;
  const componentRef = useRef(null);

  const [chartData, setChartData] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const _data = range(12).map((month) => {
      const monthDayJs = dayjs().year(year).month(month).set('date', 15);
      const monthTransactions = transactions.filter((transaction) => {
        return dayjs(transaction.date).isSame(monthDayJs, 'month');
      });

      return {
        name: monthDayJs.format('MMMM'),
        sum: monthTransactions.reduce(
          (acc, transaction) => acc + findAmount(transaction),
          0
        ),
      };
    });
    setChartData(_data);
  }, [year, transactions]);

  useEffect(() => {
    if (componentRef.current) {
      setWidth(componentRef.current.offsetWidth);
      setHeight(componentRef.current.offsetHeight);
    }
  }, [componentRef]);

  return (
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box ref={componentRef} sx={{ height: 155, width: '100%' }}>
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
            <Bar dataKey='sum' fill={color} barSize={15} />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
