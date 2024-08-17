import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import AccountBox from './AccountBox';
import ItemBox from '../../components/ItemBox';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import AccountChart from '../Networth/AccountChart';

export default function AccountPage(props) {
  const { account } = props;

  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [tabIdx, setTabIdx] = useState(0);
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

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <Grid item xs={12} mx={1}>
        <Card raised sx={{ borderRadius: '10px', py: 1 }}>
          <AccountBox account={{ ...account, net: assetSum - debtSum }} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='assets' sx={{ width: '25%' }} />
          <StyledTab label='debts' sx={{ width: '25%' }} />
          <StyledTab label='history' sx={{ width: '25%' }} />
        </StyledTabs>
      </Grid>
      {tabIdx === 0 && assets.length !== 0 && (
        <Grid item xs={12} mx={1} pt='0 !important'>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: debtSum > 0 ? 'space-between' : 'center',
            }}
          >
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
      {tabIdx === 1 && debts.length !== 0 && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: assetSum > 0 ? 'space-between' : 'center',
            }}
          >
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
      {tabIdx === 2 && (
        <Grid item xs={12} mx={1} pt={'2px !important'}>
          <AccountChart account={account} />
        </Grid>
      )}
    </>
  );
}
