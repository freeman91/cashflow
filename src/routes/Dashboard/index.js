import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import SettingsIcon from '@mui/icons-material/Settings';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import Cashflow from './Cashflow';
import UpcomingExpenses from './UpcomingExpenses';
import RecentTransactions from './RecentTransactions';
import Networth from './Networth';
import { setAppBar } from '../../store/appSettings';

const SettingsButton = () => {
  const dispatch = useDispatch();
  return (
    <IconButton
      edge='end'
      size='small'
      onClick={() => dispatch(push('/settings'))}
    >
      <SettingsIcon />
    </IconButton>
  );
};

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setAppBar({
        title: 'dashboard',
        rightAction: <SettingsButton />,
      })
    );
  }, [dispatch]);

  return (
    <Grid
      container
      spacing={0}
      sx={{
        pl: 1,
        pr: 1,
        pt: 1,
        mb: 8,
      }}
    >
      <Grid item xs={12}>
        <Cashflow />
      </Grid>

      <Grid item xs={12}>
        <Networth />
      </Grid>

      <Grid item xs={12} sx={{ mt: 1 }}>
        <UpcomingExpenses />
      </Grid>

      <Grid item xs={12} sx={{ mt: 1 }}>
        <RecentTransactions />
      </Grid>
    </Grid>
  );
}
