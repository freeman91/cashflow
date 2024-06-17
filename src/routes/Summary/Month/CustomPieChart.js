import React from 'react';

import { PieChart } from '@mui/x-charts/PieChart';
import { numberToCurrency } from '../../../helpers/currency';

export default function CustomPieChart(props) {
  const { groupedExpenses } = props;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <PieChart
        // colors={['red', 'blue', 'green']}
        series={[
          {
            valueFormatter: (item) => numberToCurrency.format(item.value),
            data: groupedExpenses,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: {
              innerRadius: 10,
              additionalRadius: -10,
              color: 'gray',
            },
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        width={350}
        height={250}
      />
    </div>
  );
}
