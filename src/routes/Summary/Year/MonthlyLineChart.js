import React from 'react';

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

  // const handleMonthClick = (month) => {
  //   dispatch(push(`/summary/${year}/${month + 1}`));
  // };

  return (
    <Grid item xs={12}>
      <Card raised>
        <CardContent sx={{ p: '4px', pt: 0, pb: '0px !important' }}>
          <LineChart
            width={375}
            height={175}
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
              legend: {
                hidden: true,
              },
            }}
          />
        </CardContent>
      </Card>
    </Grid>
  );
}
