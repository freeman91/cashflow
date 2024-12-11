import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccountBox from './AccountBox';

export default function AccountsStack() {
  const allAccounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let _accounts = allAccounts.map((account) => {
      const accountAssets = allAssets.filter(
        (asset) => asset.account_id === account.account_id
      );
      const accountDebts = allDebts.filter(
        (debt) => debt.account_id === account.account_id
      );

      const assetsSum = reduce(
        accountAssets,
        (sum, asset) => sum + asset.value,
        0
      );
      const debtsSum = reduce(
        accountDebts,
        (sum, debt) => sum + debt.amount,
        0
      );

      return { ...account, net: assetsSum - debtsSum };
    });

    _accounts = groupBy(_accounts, 'account_type');
    _accounts = sortBy(_accounts, (accounts) => {
      return accounts.reduce((acc, account) => acc + account.net, 0);
    }).reverse();
    setAccounts(_accounts);
  }, [allAccounts, allAssets, allDebts]);

  return map(accounts, (accounts) => {
    const sortedAccounts = sortBy(accounts, 'net').reverse();
    const accountType = sortedAccounts[0].account_type;
    return (
      <Grid
        key={accountType}
        item
        xs={12}
        mx={1}
        display='flex'
        justifyContent='center'
      >
        <Card sx={{ width: '100%' }}>
          <Stack spacing={1} direction='column' pt={1} pb={1}>
            <Typography
              variant='body1'
              color='text.secondary'
              align='left'
              sx={{ pl: 2 }}
            >
              {accountType}
            </Typography>
            {map(sortedAccounts, (account, idx) => {
              return (
                <React.Fragment key={`${accountType}-${idx}`}>
                  <Divider sx={{ mx: '8px !important' }} />
                  <AccountBox account={account} />
                </React.Fragment>
              );
            })}
          </Stack>
        </Card>
      </Grid>
    );
  });
}
