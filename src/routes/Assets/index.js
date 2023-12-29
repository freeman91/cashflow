import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

import { useTheme } from '@mui/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import NewTransactionButton from '../../components/NewTransactionButton';
import AssetsSummary from './AssetsSummary';
import AssetCard from '../Accounts/AssetCard';

export default function Assets() {
  const theme = useTheme();
  const accounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);

  const [groupedAssets, setGroupedAssets] = useState([]);

  useEffect(() => {
    setGroupedAssets(groupBy(allAssets, 'account_id'));
  }, [accounts, allAssets]);

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
        {map(groupedAssets, (assets, accountId) => {
          const account = find(accounts, { account_id: accountId });
          return (
            <React.Fragment key={accountId}>
              <Typography align='left' sx={{ width: '100%' }}>
                {account.name}
              </Typography>
              {map(assets, (asset) => (
                <AssetCard key={asset.asset_id} asset={asset} />
              ))}
            </React.Fragment>
          );
        })}
      </Stack>
      <NewTransactionButton transactionTypes={['asset', 'purchase', 'sale']} />
    </>
  );
}
