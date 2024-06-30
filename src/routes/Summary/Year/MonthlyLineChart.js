import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { LineChart } from '@mui/x-charts/LineChart';

import { numberToCurrency } from '../../../helpers/currency';

const MONTHS = [
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

export default function MonthlyLineChart(props) {
  const { incomeSumByMonth, expenseSumByMonth } = props;
  const theme = useTheme();
  const componentRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (componentRef.current) {
      setWidth(componentRef.current.offsetWidth);
      setHeight(componentRef.current.offsetHeight);
    }
  }, [componentRef]);

  return (
    <Grid item xs={12} pt='0 !important'>
      <Box
        ref={componentRef}
        sx={{
          height: 200,
          background: (theme) =>
            `linear-gradient(0deg, ${theme.palette.surface[300]}, ${theme.palette.surface[400]})`,
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
        }}
      >
        <LineChart
          width={width}
          height={height}
          series={[
            {
              data: incomeSumByMonth,
              label: 'incomes',
              valueFormatter: (item) => numberToCurrency.format(item),
              color: theme.palette.success.main,
            },
            {
              data: expenseSumByMonth,
              label: 'expenses',
              valueFormatter: (item) => numberToCurrency.format(item),
              color: theme.palette.danger.main,
            },
          ]}
          xAxis={[{ scaleType: 'point', data: MONTHS }]}
          leftAxis={null}
          slotProps={{
            legend: { hidden: true },
          }}
          margin={{
            top: 15,
            right: 15,
            bottom: 25,
            left: 15,
          }}
        />
      </Box>
    </Grid>
  );
}
