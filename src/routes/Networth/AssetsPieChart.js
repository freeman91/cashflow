import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { PieChart } from '@mui/x-charts/PieChart';

import { numberToCurrency } from '../../helpers/currency';

export default function Networth() {
  const allAssets = useSelector((state) => state.assets.data);

  const [assets, setAssets] = useState(0);

  useEffect(() => {
    const groupedAssets = groupBy(allAssets, 'category');
    let _assets = Object.keys(groupedAssets).map((group) => {
      const groupAssets = groupedAssets[group];
      return {
        id: group,
        label: group,
        value: reduce(groupAssets, (sum, asset) => sum + asset.value, 0),
      };
    });

    setAssets(sortBy(_assets, 'value'));
  }, [allAssets]);

  return (
    <Card>
      <CardHeader
        title='assets'
        sx={{ p: 1, pt: '4px', pb: 0 }}
        titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '8px !important' }}>
        <PieChart
          series={[
            {
              valueFormatter: (item) => numberToCurrency.format(item.value),
              data: assets,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: {
                innerRadius: 10,
                additionalRadius: -10,
                color: 'gray',
              },
            },
          ]}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          width={250}
          height={200}
        />
      </CardContent>
    </Card>
  );
}
