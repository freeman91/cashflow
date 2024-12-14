import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Grid from '@mui/material/Grid';

import { ASSETS, DEBTS } from '.';
import CurrentNetworth from '../Home/CurrentNetworth';
import SubAccountPieChart from './Networth/SubAccountPieChart';

export default function AccountsCharts() {
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [groupedAssets, setGroupedAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [groupedDebts, setGroupedDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    let _data = groupBy(assets, 'category');
    _data = map(_data, (items, category) => {
      const sum = reduce(
        items,
        (acc, item) => {
          return acc + item.value;
        },
        0
      );
      return {
        name: category,
        value: sum,
      };
    });
    _data = sortBy(_data, 'value').reverse();
    setGroupedAssets(_data);
    setAssetSum(reduce(_data, (acc, subaccount) => acc + subaccount.value, 0));
  }, [assets, debts]);

  useEffect(() => {
    let _data = groupBy(debts, 'category');
    _data = map(_data, (items, category) => {
      const sum = reduce(items, (acc, item) => acc + item.amount, 0);
      return { name: category, value: sum };
    });
    _data = sortBy(_data, 'value').reverse();
    setGroupedDebts(_data);
    setDebtSum(reduce(_data, (acc, subaccount) => acc + subaccount.value, 0));
  }, [debts]);

  const maxValue = Math.max(assetSum, debtSum);
  return (
    <Grid item xs={12} display='flex' justifyContent='center'>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <Grid item xs={12}>
          <CurrentNetworth title='current networth' />
        </Grid>
        <Grid item xs={6} mt={1}>
          <SubAccountPieChart
            type={ASSETS}
            data={groupedAssets}
            sum={assetSum}
            maxValue={maxValue}
          />
        </Grid>
        <Grid item xs={6} mt={1}>
          <SubAccountPieChart
            type={DEBTS}
            data={groupedDebts}
            sum={debtSum}
            maxValue={maxValue}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
