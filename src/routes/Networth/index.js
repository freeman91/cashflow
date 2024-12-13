import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../store/user';
import { saveNetworth } from '../../store/networths';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import CustomAppBar from '../../components/CustomAppBar';
import SaveButton from '../../components/CustomAppBar/SaveButton';
import NetworthChart from '../Accounts/Networth/NetworthChart';
import CurrentNetworth from '../Home/CurrentNetworth';
import NetworthContainer from './NetworthContainer';
import SelectedNetworth from './SelectedNetworth';

export const ASSETS = 'assets';
export const DEBTS = 'debts';

export default function Networth() {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState(ASSETS);

  const onSave = () => {
    dispatch(saveNetworth());
  };

  const onRefresh = async () => {
    dispatch(refreshAll());
  };
  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });
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
        sx={{ mt: '42px' }}
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}

        <CurrentNetworth title='current networth' />

        <Grid item xs={12} mx={1}>
          <NetworthChart setSelected={setSelected} />
        </Grid>

        {selected && (
          <NetworthContainer
            networthId={selected.id}
            setNetworthId={selected.id}
            tab={tab}
            setTab={setTab}
          />
        )}
        {selected && <SelectedNetworth networthId={selected.id} tab={tab} />}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
