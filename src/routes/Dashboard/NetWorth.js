import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';

export default function NetWorth() {
  const theme = useTheme();
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    setAssetSum(reduce(allAssets, (sum, asset) => sum + asset.value, 0));
  }, [allAssets]);

  useEffect(() => {
    setDebtSum(reduce(allDebts, (sum, debt) => sum + debt.value, 0));
  }, [allDebts]);

  const upperBound = 250000;

  return (
    <Card raised>
      <CardContent sx={{ pt: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 800 }}>
            net worth
          </Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(assetSum - debtSum)}
          </Typography>
        </div>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          <Typography variant='h6'>assets</Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(assetSum)}
          </Typography>
        </div>
        <Box
          sx={{
            height: '5px',
            width: `${Math.round((assetSum / upperBound) * 100)}%`,
            backgroundColor: theme.palette.green[400],
            borderRadius: '1px',
          }}
        />

        <Divider sx={{ mt: 2, mb: 2 }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          <Typography variant='h6'>debts</Typography>
          <Typography variant='h6'>
            {numberToCurrency.format(debtSum)}
          </Typography>
        </div>
        <Box
          sx={{
            height: '5px',
            width: `${Math.round((debtSum / upperBound) * 100)}%`,
            backgroundColor: theme.palette.red[400],
            borderRadius: '1px',
          }}
        />
      </CardContent>
    </Card>
  );
}
