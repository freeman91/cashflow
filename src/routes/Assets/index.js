import React from 'react';
import { useSelector } from 'react-redux';

import NewTransactionButton from '../../components/NewTransactionButton';

export default function Assets() {
  const assets = useSelector((state) => state.assets.data);

  console.log('assets: ', assets);

  return (
    <>
      <NewTransactionButton transactionTypes={['asset', 'purchase', 'sale']} />
    </>
  );
}
