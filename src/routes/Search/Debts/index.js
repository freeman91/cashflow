import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import filter from 'lodash/filter';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';

import Box from '@mui/material/Box';

import NewTransactionButton from '../../../components/NewTransactionButton';
import FilterOptions from './FilterOptions';
import DebtsTable from './DebtsTable';

export default function Debts() {
  const allDebts = useSelector((state) => state.debts.data);
  const accounts = useSelector((state) => state.accounts.data);
  const [total, setTotal] = useState(0);
  const [debts, setDebts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');

  useEffect(() => {
    let _debts = [...allDebts];

    // filter by category
    if (accountFilter) {
      _debts = filter(_debts, (debt) => {
        const account = find(accounts, { account_id: debt.account_id });
        return account.name === accountFilter;
      });
    }

    // filter by category
    if (categoryFilter) {
      _debts = filter(_debts, (debt) => {
        return debt.category === categoryFilter;
      });
    }

    _debts = sortBy(_debts, 'amount').reverse();
    setDebts(_debts);
  }, [allDebts, accounts, categoryFilter, accountFilter]);

  useEffect(() => {
    const _total = reduce(
      debts,
      (sum, debt) => {
        return sum + get(debt, 'amount', 0);
      },
      0
    );
    setTotal(_total);
  }, [debts]);

  return (
    <Box sx={{ mt: 1 }}>
      <FilterOptions
        total={total}
        accountFilter={accountFilter}
        setAccountFilter={setAccountFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <DebtsTable debts={debts} />
      <NewTransactionButton transactionTypes={['debt', 'purchase', 'sale']} />
    </Box>
  );
}
