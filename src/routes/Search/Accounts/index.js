import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';

import NewTransactionButton from '../../../components/NewTransactionButton';
import FilterOptions from './FilterOptions';
import AccountsTable from './AccountsTable';

export default function Accounts() {
  const allAccounts = useSelector((state) => state.accounts.data);
  const [accounts, setAccounts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    let _accounts = [...allAccounts];

    // filter by category
    if (categoryFilter) {
      _accounts = filter(_accounts, (account) => {
        return account.category === categoryFilter;
      });
    }

    _accounts = sortBy(_accounts, 'category');
    setAccounts(_accounts);
  }, [allAccounts, categoryFilter]);

  return (
    <Box sx={{ mt: 1, width: '100%', maxWidth: 700 }}>
      <FilterOptions
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <AccountsTable accounts={accounts} />
      <NewTransactionButton transactionTypes={['account', 'paycheck']} />
    </Box>
  );
}
