import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Cashflow from './Cashflow';
import UpcomingExpenses from './UpcomingExpenses';
import RecentTransactions from './RecentTransactions';
import Networth from './Networth';

export default function Dashboard() {
  const dispatch = useDispatch();

  return (
    <>
      <AppBar position='static'>
        <Toolbar sx={{ minHeight: '40px' }}>
          <Typography
            align='center'
            variant='h6'
            sx={{ flexGrow: 1, fontWeight: 800, ml: '40px' }}
          >
            dashboard
          </Typography>
          <IconButton size='small' onClick={() => dispatch(push('/settings'))}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
    </>
  );
}
