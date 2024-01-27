import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import filter from 'lodash/filter';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';

import Box from '@mui/material/Box';

import NewTransactionButton from '../../../components/NewTransactionButton';
import FilterOptions from './FilterOptions';
import AssetsTable from './AssetsTable';

export default function Assets() {
  const allAssets = useSelector((state) => state.assets.data);
  const accounts = useSelector((state) => state.accounts.data);
  const [total, setTotal] = useState(0);
  const [assets, setAssets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');

  useEffect(() => {
    let _assets = [...allAssets];

    // filter by category
    if (accountFilter) {
      _assets = filter(_assets, (asset) => {
        const account = find(accounts, { account_id: asset.account_id });
        return account.name === accountFilter;
      });
    }

    // filter by category
    if (categoryFilter) {
      _assets = filter(_assets, (asset) => {
        return asset.category === categoryFilter;
      });
    }

    _assets = sortBy(_assets, 'value').reverse();
    setAssets(_assets);
  }, [allAssets, accounts, categoryFilter, accountFilter]);

  useEffect(() => {
    const _total = reduce(
      assets,
      (sum, asset) => {
        return sum + get(asset, 'value', 0);
      },
      0
    );
    setTotal(_total);
  }, [assets]);

  return (
    <Box sx={{ mt: 1 }}>
      <FilterOptions
        total={total}
        accountFilter={accountFilter}
        setAccountFilter={setAccountFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <AssetsTable assets={assets} />
      <NewTransactionButton transactionTypes={['asset', 'purchase', 'sale']} />
    </Box>
  );
}
