import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import SettingsIcon from '@mui/icons-material/Settings';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { setAppBar } from '../../store/appSettings';
import usePullToRefresh from '../../store/hooks/usePullRefresh';
import Cashflow from './Cashflow';
import UpcomingExpenses from './UpcomingExpenses';
import RecentTransactions from './RecentTransactions';
import Networth from './Networth';
import { refresh } from '../../store/user';

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
  const ref = useRef(null);
  const loading = useSelector((state) => state.loadingBar.default);

  const onTrigger = async () => {
    dispatch(refresh());
  };

  usePullToRefresh(ref, onTrigger);

  useEffect(() => {
    dispatch(
      setAppBar({
        title: 'cashflow',
        rightAction: <SettingsButton />,
      })
    );
  }, [dispatch]);

  return (
    <Grid
      ref={ref}
      container
      spacing={1}
      sx={{
        pl: 1,
        pr: 1,
        pt: 1,
        mb: 10,
        overflowY: 'scroll',
        height: '85vh',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {loading > 0 && (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      )}
      <Grid item xs={12}>
        <Cashflow />
      </Grid>

      <Grid item xs={12}>
        <Networth />
      </Grid>

      <UpcomingExpenses />

      <Grid item xs={12}>
        <RecentTransactions />
      </Grid>
    </Grid>
  );
}
