import React from 'react';

import NewTransactionButton from '../../components/NewTransactionButton';
import IncomesTable from './IncomesTable';

export default function Income() {
  return (
    <>
      <IncomesTable />
      <NewTransactionButton transactionTypes={['income', 'paycheck']} />
    </>
  );
}
