import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Grid from '@mui/material/Grid';

import ItemBox from '../../components/ItemBox';

export default function AssetsStack() {
  const allAssets = useSelector((state) => state.assets.data);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    let _assets = allAssets;
    setAssets(sortBy(_assets, 'value').reverse());
  }, [allAssets]);

  return (
    <Grid item xs={12} mx={1} pt={'0 !important'} mb={1}>
      {map(assets, (asset) => {
        return <ItemBox key={asset.asset_id} item={asset} />;
      })}
    </Grid>
  );
}
