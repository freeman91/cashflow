import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import Grid from '@mui/material/Grid';

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

    setAccounts(sortBy(_accounts, 'net').reverse());
  }, [allAccounts, allAssets, allDebts]);

  return (
    <Grid item xs={12} mx={1} mt={2}>
      {map(accounts, (account) => {
        return <AccountBox key={account.account_id} account={account} />;
      })}
    </Grid>
  );
}
