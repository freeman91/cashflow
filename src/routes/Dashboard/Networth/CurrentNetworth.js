import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';
import NetworthSummaryStack from './NetworthSummaryStack';

export default function CurrentNetworth() {
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    setAssetSum(reduce(allAssets, (sum, asset) => sum + asset.value, 0));
    setDebtSum(reduce(allDebts, (sum, debt) => sum + debt.amount, 0));
  }, [allAssets, allDebts]);

  return <NetworthSummaryStack assetSum={assetSum} debtSum={debtSum} />;
}
