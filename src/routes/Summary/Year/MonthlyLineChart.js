import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from '@emotion/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
    <Grid item xs={12}>
      <Card raised>
        <CardContent
          ref={componentRef}
          sx={{ p: '4px', pt: 0, pb: '0px !important', height: 175 }}
        >
          <LineChart
            width={width}
            height={height}
            series={[
              {
                data: incomeSumByMonth,
                label: 'incomes',
                valueFormatter: (item) => numberToCurrency.format(item),
                color: theme.palette.green[600],
              },
              {
                data: expenseSumByMonth,
                label: 'expenses',
                valueFormatter: (item) => numberToCurrency.format(item),
                color: theme.palette.red[600],
              },
            ]}
            xAxis={[{ scaleType: 'point', data: MONTHS }]}
            leftAxis={null}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        </CardContent>
      </Card>
    </Grid>
  );
}
