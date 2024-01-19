import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@mui/styles';
import Stack from '@mui/material/Stack';

import NewTransactionButton from '../../components/NewTransactionButton';
import AssetsSummary from './AssetsSummary';
import AssetCard from '../Accounts/AssetCard';

export default function Assets() {
  const theme = useTheme();
  const allAssets = useSelector((state) => state.assets.data);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    setAssets(sortBy(allAssets, 'value').reverse());
  }, [allAssets]);

  return (
    <>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ minWidth: 550, maxWidth: theme.breakpoints.maxWidth }}
      >
        <AssetsSummary />
        {map(assets, (asset) => {
          return <AssetCard key={asset.asset_id} asset={asset} />;
        })}
      </Stack>
      <NewTransactionButton transactionTypes={['asset', 'purchase', 'sale']} />
    </>
  );
}
