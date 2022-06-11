import { useTheme } from '@emotion/react';
import { Box, Stack, Typography } from '@mui/material';
import { max, reduce } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { numberToCurrency } from '../../helpers/currency';

export default function CurrentNetWorth() {
  const theme = useTheme();
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const assetSum = reduce(
    assets,
    (acc, asset) => {
      return acc + asset.value;
    },
    0
  );
  const debtSum = reduce(
    debts,
    (acc, debt) => {
      return acc + debt.value;
    },
    0
  );

  const upperBound = max([assetSum, debtSum]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Stack width={'75%'} mr={theme.spacing(4)}>
        <Box
          sx={{
            height: '1.25rem',
            width: `100%`,
            backgroundColor: theme.palette.grey[800],
            borderRadius: '5px',
            m: theme.spacing(1),
          }}
        >
          <Box
            sx={{
              height: '1.25rem',
              width: `${Math.round((assetSum / upperBound) * 100)}%`,
              backgroundColor: theme.palette.green[400],
              borderRadius: '5px',
            }}
          >
            <Typography align='left' sx={{ ml: theme.spacing(2) }}>
              {numberToCurrency.format(assetSum)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            height: '1.25rem',
            width: `100%`,
            backgroundColor: theme.palette.grey[800],
            borderRadius: '5px',
            m: theme.spacing(1),
          }}
        >
          <Box
            sx={{
              height: '1.25rem',
              width: `${Math.round((debtSum / upperBound) * 100)}%`,
              backgroundColor: theme.palette.red[400],
              borderRadius: '5px',
            }}
          >
            <Typography align='left' sx={{ ml: theme.spacing(2) }}>
              {numberToCurrency.format(debtSum)}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Box>
        <Typography
          variant='h5'
          sx={{
            borderBottom: `3px solid grey`,
          }}
        >
          {numberToCurrency.format(assetSum - debtSum)}
        </Typography>
        <Typography variant='body2'>net worth</Typography>
      </Box>
    </div>
  );
}
