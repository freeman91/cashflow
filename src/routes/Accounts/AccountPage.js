import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ItemsTable from './ItemsTable';
import AccountSummary from './AccountSummary';
import { numberToCurrency } from '../../helpers/currency';

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
      <AccountSummary account={account} assetSum={assetSum} debtSum={debtSum} />
      {assets.length !== 0 && (
        <Grid item xs={12}>
          <Card raised>
            <CardHeader
              disableTypography
              title={
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant='body1' align='left' fontWeight='bold'>
                    assets
                  </Typography>
                  {debtSum > 0 && (
                    <Typography variant='h6' align='right' fontWeight='bold'>
                      {numberToCurrency.format(assetSum)}
                    </Typography>
                  )}
                </Stack>
              }
              sx={{ p: 1, pt: '4px', pb: 0 }}
            />
            <CardContent
              sx={{
                p: 1,
                pt: 0,
                pb: `${assets.length ? 0 : '4px'} !important`,
              }}
            >
              <ItemsTable items={assets} />
            </CardContent>
          </Card>
        </Grid>
      )}
      {debts.length !== 0 && (
        <Grid item xs={12}>
          <Card raised>
            <CardHeader
              disableTypography
              title={
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant='body1' align='left' fontWeight='bold'>
                    debts
                  </Typography>
                  {assetSum > 0 && (
                    <Typography variant='h6' align='right' fontWeight='bold'>
                      {numberToCurrency.format(debtSum)}
                    </Typography>
                  )}
                </Stack>
              }
              sx={{ p: 1, pt: '4px', pb: 0 }}
            />
            <CardContent
              sx={{ p: 1, pt: 0, pb: `${debts.length ? 0 : '4px'} !important` }}
            >
              <ItemsTable items={debts} />
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  );
}
