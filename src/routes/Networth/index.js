import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../store/user';
import { saveNetworth } from '../../store/networths';
import CustomAppBar from '../../components/CustomAppBar';
import SaveButton from '../../components/CustomAppBar/SaveButton';
import NetworthChart from '../Accounts/Networth/NetworthChart';
import CurrentNetworth from '../Home/CurrentNetworth';
import NetworthContainer from './NetworthContainer';
import PullToRefresh from '../../components/PullToRefresh';

export default function Networth() {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(null);

  const onSave = () => {
    dispatch(saveNetworth());
  };

  const onRefresh = async () => {
    dispatch(refreshAll());
  };
  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            networth
          </Typography>
        }
        right={
          <SaveButton onClick={onSave} tooltipTitle='save current networth' />
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='center'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />

        <Grid item xs={12}>
          <CurrentNetworth title='current networth' />
        </Grid>

        <Grid item xs={12} mx={1}>
          <NetworthChart selected={selected} setSelected={setSelected} />
        </Grid>

        <NetworthContainer networthId={selected?.id} />
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
