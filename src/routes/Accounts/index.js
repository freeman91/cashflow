import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import Box from '@mui/material/Box';

import AccountsRoot from './Root';
import Account from './Account';

export default function Accounts() {
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    let accountName = get(location.pathname.split('/'), 2);
    accountName = accountName?.replace(/%20/g, ' ');

    if (accountName) {
      const _account = accounts.find((a) => a.name === accountName);
      if (_account) {
        setAccount(_account);
        return;
      }
    }
    setAccount(null);
  }, [location, accounts]);

  return (
    <Box sx={{ width: '100%', mb: 5 }}>
      {!account ? <AccountsRoot /> : <Account account={account} />}
    </Box>
  );
}
