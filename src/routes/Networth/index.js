import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@mui/material';

import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import { getNetworths } from '../../store/networths';
import NetWorthContainer from '../../components/containers/NetWorthContainer';
import AssetsContainer from '../../components/containers/AssetsContainer';
import DebtsContainer from '../../components/containers/DebtsContainer';
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
        <NetWorthContainer />
      </Grid>
      <Grid item xs={6}>
        <AssetsContainer />
      </Grid>
      <Grid item xs={6}>
        <DebtsContainer />
      </Grid>
      <Grid item xs={12} sx={{ mt: '2rem' }}>
        <NetworthChart />
      </Grid>
    </Grid>
  );
}
