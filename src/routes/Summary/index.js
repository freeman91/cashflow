import React from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { refresh } from '../../store/user';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import CustomAppBar from '../../components/CustomAppBar';

export default function Summary() {
  const dispatch = useDispatch();

  // const [tab, setTab] = useState('accounts');

  const onRefresh = async () => {
    dispatch(refresh());
  };
  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

  // const handleChangeTab = (event, newTab) => {
  //   setTab(newTab);
  // };

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            summary
          </Typography>
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ pt: 1, mt: '42px' }}
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}

        {/* <Grid item xs={12} mb={10} /> */}
      </Grid>
    </Box>
  );
}
