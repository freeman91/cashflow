import React from 'react';

import Grid from '@mui/material/Grid';

import { ACCOUNTS, ASSETS, DEBTS } from '.';
import CurrentNetworth from '../Home/CurrentNetworth';
import SubAccountPieChart from './Networth/SubAccountPieChart';
import AccountsChart from './AccountsChart';

export default function AccountsCharts(props) {
  const { tab } = props;

  return (
    <Grid item xs={12} display='flex' justifyContent='center'>
      <Grid container justifyContent='center' alignItems='center'>
        <CurrentNetworth title='current networth' />
        <Grid item xs={12} mx={1}>
          {tab === ACCOUNTS && <AccountsChart />}
          {tab === ASSETS && <SubAccountPieChart type={ASSETS} />}
          {tab === DEBTS && <SubAccountPieChart type={DEBTS} />}
        </Grid>
      </Grid>
    </Grid>
  );
}
