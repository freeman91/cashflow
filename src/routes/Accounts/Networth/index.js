import React from 'react';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ACCOUNTS, ASSETS, DEBTS } from '..';
import CurrentNetworth from '../../Home/CurrentNetworth';
import NetworthChart from './NetworthChart';
import SubAccountPieChart from './SubAccountPieChart';
import CustomToggleButton from '../../../components/CustomToggleButton';

export default function AccountsNetworth(props) {
  const { tab, handleChangeTab } = props;

  return (
    <Grid item xs={12} display='flex' justifyContent='center'>
      <Card sx={{ width: '100%', mx: 1, p: 1 }}>
        <Grid container justifyContent='space-between' alignItems='flex-start'>
          <CurrentNetworth textSize='small' align='left' />
          <Grid item xs={6} display='flex' justifyContent='flex-end'>
            <ToggleButtonGroup
              color='primary'
              value={tab}
              exclusive
              onChange={handleChangeTab}
              sx={{ backgroundColor: 'surface.200' }}
            >
              <CustomToggleButton value={ACCOUNTS}>
                <ShowChartIcon />
              </CustomToggleButton>
              <CustomToggleButton value={ASSETS}>
                <AccountBalanceWalletIcon />
              </CustomToggleButton>
              <CustomToggleButton value={DEBTS}>
                <CreditCardIcon />
              </CustomToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            {tab === ACCOUNTS && <NetworthChart />}
            {tab === ASSETS && <SubAccountPieChart type={ASSETS} />}
            {tab === DEBTS && <SubAccountPieChart type={DEBTS} />}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
