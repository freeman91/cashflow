import React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

import usePullToRefresh from '../store/hooks/usePullToRefresh';

export default function PullToRefresh(props) {
  const { onRefresh } = props;
  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

  if (isRefreshing || pullPosition > 100) {
    return (
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ mt: 1 }} />
      </Grid>
    );
  }

  return null;
}
