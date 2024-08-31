import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import ItemBox from '../../../../components/ItemBox';

export default function AssetsStack() {
  const allAssets = useSelector((state) => state.assets.data);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    let _assets = allAssets;
    setAssets(sortBy(_assets, 'value').reverse());
  }, [allAssets]);

  return (
    <Grid item xs={12} mx={1} mb={1} pt='0px !important'>
      <Card raised>
        <Stack spacing={1} direction='column' pt={1} pb={1}>
          {map(assets, (asset, idx) => {
            return (
              <React.Fragment key={asset.asset_id}>
                <ItemBox item={asset} />
                {idx < assets.length - 1 && (
                  <Divider sx={{ mx: '8px !important' }} />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </Card>
    </Grid>
  );
}
