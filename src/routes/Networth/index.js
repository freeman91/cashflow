import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@mui/material';

import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import { getNetworths } from '../../store/networths';
import NetWorthCard from '../../components/Card/NetWorthCard';
import AssetsCard from '../../components/Card/AssetsCard';
import DebtsCard from '../../components/Card/DebtsCard';
import NetworthChart from '../../components/charts/NetworthChart';

export default function Networth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAssets());
    dispatch(getDebts());
    dispatch(getNetworths());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ mb: '2rem', mt: '2rem' }}>
        <NetWorthCard />
      </Grid>
      <Grid item xs={6}>
        <AssetsCard />
      </Grid>
      <Grid item xs={6}>
        <DebtsCard />
      </Grid>
      <Grid item xs={12} sx={{ mt: '2rem' }}>
        <NetworthChart />
      </Grid>
    </Grid>
  );
}
