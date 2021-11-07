import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@mui/material';

import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import NetWorthCard from '../../components/Card/NetWorthCard';
import AssetsCard from '../../components/Card/AssetsCard';
import DebtsCard from '../../components/Card/DebtsCard';

export default function Networth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAssets());
    dispatch(getDebts());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <NetWorthCard />
      </Grid>
      <Grid item xs={6}>
        <AssetsCard />
      </Grid>
      <Grid item xs={6}>
        <DebtsCard />
      </Grid>
    </Grid>
  );
}
