import React from 'react';
import { useSelector } from 'react-redux';

import NewTransactionButton from '../../components/NewTransactionButton';

export default function Debts() {
  const debts = useSelector((state) => state.debts.data);
  console.log('debts: ', debts);

  return (
    <>
      <NewTransactionButton
        transactionTypes={['debt', 'borrow', 'repayment']}
      />
    </>
  );
}
