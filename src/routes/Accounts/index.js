import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

import { useTheme } from '@mui/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ACCOUNT_TYPES } from '../../components/Dialog/AccountDialog';

import NewTransactionButton from '../../components/NewTransactionButton';
import AccountCard from './AccountCard';

export default function Accounts() {
  const theme = useTheme();
  const allAccounts = useSelector((state) => state.accounts.data);

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    setAccounts(groupBy(allAccounts, 'account_type'));
  }, [allAccounts]);

  const renderAccountsOfType = (type) => {
    return (
      <React.Fragment key={type}>
        <Typography key={type} align='left' sx={{ width: '100%' }}>
          {type}
        </Typography>
        {map(accounts[type], (account) => (
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
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        {ACCOUNT_TYPES.map(renderAccountsOfType)}
      </Stack>
      <NewTransactionButton transactionTypes={['account', 'asset', 'debt']} />
    </>
  );
}
