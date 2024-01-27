import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';

import Box from '@mui/material/Box';

import NewTransactionButton from '../../../components/NewTransactionButton';
import FilterOptions from './FilterOptions';
import BillsTable from './BillsTable';

export default function Bills() {
  const allBills = useSelector((state) => state.bills.data);

  const [total, setTotal] = useState(0);
  const [bills, setBills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  useEffect(() => {
    let _bills = [...allBills];

    // filter by category
    if (categoryFilter) {
      _bills = filter(_bills, (bill) => {
        return bill.category === categoryFilter;
      });
    }

    // filter by source
    if (vendorFilter) {
      _bills = filter(_bills, (bill) => {
        return bill.vendor === vendorFilter;
      });
    }

    _bills = sortBy(_bills, 'day');
    setBills(_bills);
  }, [allBills, categoryFilter, vendorFilter]);

  useEffect(() => {
    const _total = reduce(
      bills,
      (sum, bill) => {
        return sum + get(bill, 'amount', 0);
      },
      0
    );
    setTotal(_total);
  }, [bills]);

  return (
    <Box sx={{ mt: 1 }}>
      <FilterOptions
        total={total}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        vendorFilter={vendorFilter}
        setVendorFilter={setVendorFilter}
      />
      <BillsTable bills={bills} />
      <NewTransactionButton transactionTypes={['bill']} />
    </Box>
  );
}
