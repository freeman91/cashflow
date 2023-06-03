import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/styles';
import { Box, Grid, Typography } from '@mui/material';
import { filter, get, map, reduce, sortBy } from 'lodash';

import { numberToCurrency } from '../../helpers/currency';

export default function AssetsBarChart() {
  const theme = useTheme();
  const storeAssets = useSelector((state) => state.assets.data);

  const [assets, setAssets] = useState([]);

  // sort assets
  useEffect(() => {
    let data = [];
    let _assets = sortBy(
      filter(storeAssets, (asset) => asset.value !== 0),
      'value'
    ).reverse();

    for (let i = 0; i < 5; i++) {
      const asset = _assets.shift();
      if (asset) data.push(asset);
    }

    const otherAssetsValue = reduce(
      _assets,
      (acc, asset) => acc + get(asset, 'value', 0),
      0
    );

    if (otherAssetsValue) {
      data.push({ name: 'Other', value: otherAssetsValue, id: 'other-assets' });
    }

    setAssets(data);
  }, [storeAssets]);

  const assetMax = get(assets, '0.value', 1000);

  return (
    <Grid
      item
      xs={6}
      container
      justifyContent='center'
      display='flex'
      height={300}
      sx={{ paddingTop: '0 !important' }}
    >
      {map(assets, (asset) => {
        return (
          <React.Fragment key={asset.id}>
            <Grid item xs={5}>
              <Typography align='left'>{asset.name}</Typography>
            </Grid>

            <Grid item xs={7}>
              <Box
                sx={{
                  backgroundColor: theme.palette.green[600],
                  width: `${(asset.value / assetMax) * 100}%`,
                  borderRadius: '3px',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography ml={2}>
                  {numberToCurrency.format(asset.value)}
                </Typography>
              </Box>
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
}
