import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';

import NewTransactionButton from '../../components/NewTransactionButton';
import AccountStack from './AccountStack';
import AccountDashboard from './AccountDashboard';

export default function Accounts() {
  const location = useLocation();
  const [id, setId] = useState('');

  useEffect(() => {
    let _pathname = location.pathname;
    let _id = _pathname.replace('/app/accounts', '');
    _id = _id.replace('/', '');
    setId(_id);
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      {id ? <AccountDashboard account_id={id} /> : <AccountStack />}
      <NewTransactionButton transactionTypes={['account', 'asset', 'debt']} />
    </Box>
  );
}
