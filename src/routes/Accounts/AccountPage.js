import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import AccountBox from './AccountBox';
import ItemBox from '../../components/ItemBox';

export default function AccountPage(props) {
  const { account } = props;

  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [assets, setAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [debts, setDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    const accountAssets = filter(allAssets, { account_id: account.account_id });
    setAssetSum(reduce(accountAssets, (acc, asset) => acc + asset.value, 0));
    setAssets(sortBy(accountAssets, 'value').reverse());
  }, [allAssets, account.account_id]);

  useEffect(() => {
    const accountDebts = filter(allDebts, { account_id: account.account_id });
    setDebtSum(reduce(accountDebts, (acc, debt) => acc + debt.amount, 0));
    setDebts(sortBy(accountDebts, 'amount'));
  }, [allDebts, account.account_id]);

  return (
    <>
      <Grid item xs={12} mx={1}>
        <AccountBox account={{ ...account, net: assetSum - debtSum }} />
      </Grid>
      {assets.length !== 0 && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: debtSum > 0 ? 'space-between' : 'center',
            }}
          >
            <Typography variant='h6' fontWeight='bold' sx={{ width: '100%' }}>
              assets
            </Typography>
            {debtSum > 0 && (
              <Typography variant='h6' align='right' fontWeight='bold'>
                {numberToCurrency.format(assetSum)}
              </Typography>
            )}
          </Box>
          {map(assets, (asset) => {
            return <ItemBox key={asset.asset_id} item={asset} />;
          })}
        </Grid>
      )}
      {debts.length !== 0 && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: assetSum > 0 ? 'space-between' : 'center',
            }}
          >
            <Typography variant='h6' fontWeight='bold' sx={{ width: '100%' }}>
              debts
            </Typography>
            {debtSum > 0 && (
              <Typography variant='h6' align='right' fontWeight='bold'>
                {numberToCurrency.format(debtSum)}
              </Typography>
            )}
          </Box>
          {map(debts, (debt) => {
            return <ItemBox key={debt.debt_id} item={debt} />;
          })}
        </Grid>
      )}
    </>
  );
}
