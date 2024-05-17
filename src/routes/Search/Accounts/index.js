import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import AccountCard from './AccountCard';
import NewTransactionButton from '../../../components/NewTransactionButton';

export default function Accounts() {
  const allAccounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [groupedAccounts, setGroupedAccounts] = useState([]);

  useEffect(() => {
    let _accounts = map(allAccounts, (account) => {
      const accountAssets = filter(allAssets, (asset) => {
        return asset.account_id === account.account_id;
      });
      const accountDebts = filter(allDebts, (debt) => {
        return debt.account_id === account.account_id;
      });
      return {
        ...account,
        value:
          accountAssets.reduce((acc, asset) => acc + asset.value, 0) -
          accountDebts.reduce((acc, debt) => acc + debt.amount, 0),
      };
    });
    setGroupedAccounts(
      groupBy(sortBy(_accounts, 'value').reverse(), 'account_type')
    );
  }, [allAccounts, allAssets, allDebts]);

  return (
    <Grid container sx={{ mt: 1, width: '100%', maxWidth: 1000 }} spacing={1}>
      {Object.keys(groupedAccounts).map((type) => {
        return (
          <>
            <Grid item xs={12} key={type}>
              <Typography color='secondary' variant='h6'>
                {type}
              </Typography>
              <Divider />
            </Grid>
            {groupedAccounts[type].map((account) => (
              <Grid item xs={12} sm={6} md={4} key={account.id}>
                <AccountCard account={account} />
              </Grid>
            ))}
          </>
        );
      })}
      <NewTransactionButton transactionTypes={['account', 'paycheck']} />
    </Grid>
  );
}
