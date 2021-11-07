import React from 'react';
import { useSelector } from 'react-redux';
import { get, reduce } from 'lodash';
import { Card, CardContent, Typography } from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';
import { divStyle } from './styles';

export default function AssetsCard() {
  const { data: assets } = useSelector((state) => state.assets);
  const { data: debts } = useSelector((state) => state.debts);

  let assetSum = reduce(
    assets,
    (sum, asset) => {
      return sum + get(asset, 'value');
    },
    0
  );
  let debtSum = reduce(
    debts,
    (sum, debt) => {
      return sum + get(debt, 'value');
    },
    0
  );

  return (
    <Card>
      <CardContent>
        <div style={divStyle}>
          <Typography variant='h4'>Net Worth</Typography>
          <Typography variant='h4'>
            {numberToCurrency.format(assetSum - debtSum)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
