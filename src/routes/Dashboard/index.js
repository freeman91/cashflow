import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { setAppBar } from '../../store/appSettings';
import { refresh } from '../../store/user';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import Cashflow from './Cashflow';
import Networth from './Networth';
import Transactions from './Transactions';

const SettingsButton = () => {
  const dispatch = useDispatch();
  return (
    <IconButton
      edge='end'
      size='small'
      onClick={() => dispatch(push('/settings'))}
    >
      <MoreVertIcon />
    </IconButton>
  );
};

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
        // title: 'cashflow',
        rightAction: <SettingsButton />,
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
