import React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';

import NewTransactionButton from '../../../components/NewTransactionButton';
import BillsTable from './BillsTable';

export default function Bills() {
  const allBills = useSelector((state) => state.bills.data);

  return (
    <Box sx={{ mt: 1, width: '100%', maxWidth: 700 }}>
      <BillsTable bills={allBills} />
      <NewTransactionButton transactionTypes={['bill']} />
    </Box>
  );
}
