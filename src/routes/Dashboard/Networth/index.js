import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import reduce from 'lodash/reduce';

import Grid from '@mui/material/Grid';

import NetworthContainer from './NetworthContainer';
import NetworthChart from './NetworthChart';
import SelectedNetworth from './SelectedNetworth';
import CurrentNetworth from './CurrentNetworth';

export default function Networth() {
  const today = dayjs();
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);
  const networths = useSelector((state) => state.networths.data);

  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedNetworth, setSelectedNetworth] = useState(null);

  useEffect(() => {
    if (!selectedNetworth) {
      setAssetSum(reduce(allAssets, (sum, asset) => sum + asset.value, 0));
    } else {
      setAssetSum(
        reduce(selectedNetworth.assets, (sum, asset) => sum + asset.value, 0)
      );
    }
  }, [allAssets, selectedNetworth]);

  useEffect(() => {
    if (!selectedNetworth) {
      setDebtSum(reduce(allDebts, (sum, debt) => sum + debt.amount, 0));
    } else {
      setDebtSum(
        reduce(
          selectedNetworth.debts,
          (sum, debt) => {
            return sum + debt.value;
          },
          0
        )
      );
    }
  }, [allDebts, selectedNetworth]);

  useEffect(() => {
    if (selectedId) {
      setSelectedNetworth(
        networths.find((networth) => networth.networth_id === selectedId)
      );
    } else {
      setSelectedNetworth(null);
    }
  }, [networths, selectedId]);

  const handleSelectPreviousMonth = () => {
    let networth;
    for (let i = 0; i <= networths.length - 1; i++) {
      if (!networth || networths[i].date > networth.date) {
        networth = networths[i];
      }
    }
    setSelectedId(networth.networth_id);
  };

  const subtitle = selectedNetworth
    ? `${dayjs(selectedNetworth.date).format('MMMM YYYY')}`
    : 'current';
  return (
    <>
      <Grid item xs={12} pt='0 !important'>
        <NetworthChart selectedId={selectedId} setSelectedId={setSelectedId} />
      </Grid>
      <NetworthContainer
        assetSum={assetSum}
        debtSum={debtSum}
        year={today.year()}
        month={today.month() + 1}
        subtitle={subtitle}
      />
      {selectedId ? (
        <SelectedNetworth
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      ) : (
        <CurrentNetworth
          handleSelectPreviousMonth={handleSelectPreviousMonth}
        />
      )}
    </>
  );
}
