import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import { darken } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';

export default function AccountsChart() {
  const theme = useTheme();

  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [assets, setAssets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    let _assets = groupBy(allAssets, 'category');
    _assets = map(_assets, (assets, category) => {
      const sum = reduce(assets, (acc, asset) => acc + asset.value, 0);
      return {
        name: category,
        value: sum,
      };
    });
    _assets = sortBy(_assets, 'value').reverse();
    setAssets(_assets);
    setAssetSum(reduce(_assets, (acc, asset) => acc + asset.value, 0));
  }, [allAssets]);

  useEffect(() => {
    let _debts = groupBy(allDebts, 'category');
    _debts = map(_debts, (debts, category) => {
      const sum = reduce(debts, (acc, debt) => acc + debt.amount, 0);
      return {
        name: category,
        value: sum,
      };
    });
    _debts = sortBy(_debts, 'value').reverse();
    setDebts(_debts);
    setDebtSum(reduce(_debts, (acc, debt) => acc + debt.value, 0));
  }, [allDebts]);

  console.log('debts: ', debts);

  const maxValue = Math.max(assetSum, debtSum);
  return (
    <Box
      width='100%'
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', my: 0.5 }}>
        {assets.map((asset, idx) => {
          const percent = Math.max(asset.value / maxValue, 0.02);
          let borderRadius = 'unset';
          if (idx === 0) {
            borderRadius = '4px 0 0 4px';
          } else if (idx === assets.length - 1) {
            borderRadius = '0 4px 4px 0';
          }
          const greens = Object.keys(theme.palette.green).reverse();
          const colorIdx = greens[idx % greens.length];
          const color = theme.palette.green[colorIdx];
          return (
            <Box
              key={asset.asset_id}
              sx={{
                width: `${percent * 100}%`,
                height: '20px',
                backgroundImage: (theme) =>
                  `linear-gradient(to bottom, ${color}, ${darken(color, 0.2)})`,
                borderRadius,
                borderRight: `1px solid ${theme.palette.surface[150]}`,
              }}
            />
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', my: 0.5 }}>
        {debts.map((debt, idx) => {
          const percent = Math.max(debt.value / maxValue, 0.02);
          let borderRadius = 'unset';
          if (idx === 0) {
            borderRadius = '4px 0 0 4px';
          } else if (idx === debts.length - 1) {
            borderRadius = '0 4px 4px 0';
          }
          const reds = Object.keys(theme.palette.red).reverse();
          const colorIdx = reds[idx % reds.length];
          const color = theme.palette.red[colorIdx];

          return (
            <Box
              key={debt.debt_id}
              sx={{
                width: `${percent * 100}%`,
                height: '20px',
                backgroundImage: (theme) =>
                  `linear-gradient(to bottom, ${color}, ${darken(color, 0.2)})`,
                borderRadius,
                borderRight: `1px solid ${theme.palette.surface[150]}`,
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
