import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@mui/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ACCOUNT_TYPES } from '../../components/Dialog/AccountDialog';

import NewTransactionButton from '../../components/NewTransactionButton';
import AccountCard from './AccountCard';
import AccountsSummary from './AccountsSummary';

export default function Accounts() {
  const theme = useTheme();
  const allAccounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let _accounts = map(allAccounts, (account) => {
      const assets = filter(allAssets, { account_id: account.account_id });
      const debts = filter(allDebts, { account_id: account.account_id });

      const assetSum = reduce(assets, (sum, asset) => sum + asset.value, 0);
      const debtSum = reduce(debts, (sum, debt) => sum + debt.amount, 0);

      return {
        ...account,
        net: assetSum - debtSum,
      };
    });

    setAccounts(groupBy(_accounts, 'account_type'));
  }, [allAccounts, allAssets, allDebts]);

  const renderAccountsOfType = (type) => {
    const accountsOfType = sortBy(accounts[type], 'net').reverse();
    return (
      <React.Fragment key={type}>
        <Typography key={type} align='left' sx={{ width: '100%' }}>
          {type}
        </Typography>
        {map(accountsOfType, (account) => (
          <AccountCard key={account.account_id} account={account} />
        ))}
      </React.Fragment>
    );
  };

  return (
    <>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ minWidth: 550, maxWidth: theme.breakpoints.maxWidth }}
      >
        <AccountsSummary />
        {ACCOUNT_TYPES.map(renderAccountsOfType)}
      </Stack>
      <NewTransactionButton transactionTypes={['account', 'asset', 'debt']} />
    </>
  );
}
