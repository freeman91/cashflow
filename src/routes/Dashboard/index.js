import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { setAppBar } from '../../store/appSettings';
import { refresh } from '../../store/user';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import Cashflow from './Cashflow';
import Networth from './Networth';
import Transactions from './Transactions';
import { CalendarButton, SettingsButton } from '../Layout/CustomAppBar';

export default function Dashboard() {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const onRefresh = async () => {
    dispatch(refresh());
  };

  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

  useEffect(() => {
    dispatch(
      setAppBar({
        rightAction: (
          <Stack spacing={1} direction='row'>
            <CalendarButton />
            <SettingsButton />
          </Stack>
        ),
      })
    );
  }, [dispatch]);

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Grid
        ref={ref}
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}
        <Cashflow />
        <Networth />
        <Transactions />
      </Grid>
    </Box>
  );
}
