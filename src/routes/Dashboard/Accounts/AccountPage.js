import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../helpers/currency';
import { StyledSubtab, StyledSubtabs } from '../../../components/StyledSubtabs';
import AccountBox from './AccountBox';
import ItemBox from '../../../components/ItemBox';
import AccountChart from './AccountChart';
import BoxFlexCenter from '../../../components/BoxFlexCenter';

const ASSETS = 'assets';
const DEBTS = 'debts';
const HISTORY = 'history';

export default function AccountPage(props) {
  const { account } = props;

  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [tab, setTab] = useState(null);
  const [assets, setAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [debts, setDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    if (assets.length > 0) {
      setTab(ASSETS);
    } else if (debts.length > 0) {
      setTab(DEBTS);
    } else {
      setTab(HISTORY);
    }
  }, [assets.length, debts.length]);

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
    setTab(newValue);
  };

  return (
    <>
      <Grid item xs={12} mx={1} pt='0 !important'>
        <Card raised sx={{ py: 1 }}>
          <AccountBox account={{ ...account, net: assetSum - debtSum }} />
        </Card>
      </Grid>
      {tab !== null && (
        <Grid item xs={12} mx={1} pt='12px !important'>
          <StyledSubtabs
            value={tab}
            onChange={handleChange}
            variant='fullWidth'
          >
            {assets.length > 0 && (
              <StyledSubtab label={ASSETS} value={ASSETS} />
            )}
            {debts.length > 0 && <StyledSubtab label={DEBTS} value={DEBTS} />}
            <StyledSubtab label={HISTORY} value={HISTORY} />
          </StyledSubtabs>
        </Grid>
      )}

      {tab === ASSETS && assets.length !== 0 && (
        <Grid item xs={12} mx={1} pt='0px !important'>
          {assets.length > 1 && debts.length > 0 && (
            <BoxFlexCenter>
              <Typography variant='h5' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h5' color='white' fontWeight='bold'>
                {_numberToCurrency.format(assetSum)}
              </Typography>
            </BoxFlexCenter>
          )}
          <Card raised>
            <Stack spacing={1} direction='column' py={1}>
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
      )}
      {tab === DEBTS && debts.length !== 0 && (
        <Grid item xs={12} mx={1} pt='0px !important'>
          {debts.length > 1 && assets.length > 0 && (
            <BoxFlexCenter>
              <Typography variant='h5' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h5' color='white' fontWeight='bold'>
                {_numberToCurrency.format(debtSum)}
              </Typography>
            </BoxFlexCenter>
          )}
          <Card raised>
            <Stack spacing={1} direction='column' py={1}>
              {map(debts, (debt, idx) => {
                return (
                  <React.Fragment key={debt.debt_id}>
                    <ItemBox item={debt} />
                    {idx < debts.length - 1 && (
                      <Divider sx={{ mx: '8px !important' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        </Grid>
      )}
      {tab === HISTORY && (
        <Grid item xs={12} mx={1} pt='0px !important'>
          <AccountChart account={account} />
        </Grid>
      )}
    </>
  );
}
