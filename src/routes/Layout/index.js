import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { getUser } from '../../store/user';
import { getExpenses } from '../../store/expenses';
import { getIncomes } from '../../store/incomes';
import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import Dashboard from '../Dashboard';
import Transactions from '../Transactions';
import Accounts from '../Accounts';
import { Grid, Toolbar } from '@mui/material';
import Settings from '../Settings';
import { getNetworths } from '../../store/networths';
import { getAccounts } from '../../store/accounts';
// import { getNetworthsAPI } from '../../api';

const Root = styled('div')({
  display: 'flex',
  height: '100%',
  width: '100vw',
});

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function Layout() {
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getExpenses());
    dispatch(getIncomes());
    dispatch(getAssets());
    dispatch(getDebts());
    dispatch(getNetworths());
    dispatch(getAccounts());
  });

  const handleChange = (e, idx) => {
    setTabIndex(idx);
  };

  return (
    <Root>
      <CssBaseline />
      <Main>
        <Grid container>
          <Grid item xs={12}>
            <AppBar position='static' color='default'>
              <Toolbar>
                <Tabs
                  value={tabIndex}
                  onChange={handleChange}
                  indicatorColor='primary'
                  textColor='primary'
                  sx={{
                    margin: 'auto',
                    justifyContent: 'space-between',
                  }}
                >
                  <Tab
                    label='Dashboard'
                    icon={<DashboardIcon />}
                    {...a11yProps(0)}
                    sx={{
                      width: '12rem',
                    }}
                  />
                  <Tab
                    label='Transactions'
                    icon={<ReceiptLongIcon />}
                    {...a11yProps(1)}
                    sx={{
                      width: '12rem',
                    }}
                  />
                  <Tab
                    label='Accounts'
                    icon={<AccountBalanceIcon />}
                    {...a11yProps(2)}
                    sx={{
                      width: '12rem',
                    }}
                  />
                  <Tab
                    label='Settings'
                    icon={<SettingsIcon />}
                    {...a11yProps(3)}
                    sx={{
                      width: '12rem',
                    }}
                  />
                </Tabs>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={2}>
            <h4>Net Worth</h4>
            <div style={{ marginBottom: '15rem' }}></div>
            <h4>Month Stats</h4>
            <div style={{ marginBottom: '15rem' }}></div>
            <h4>Upcoming Bills</h4>
          </Grid>
          <Grid item xs={9}>
            <TabPanel value={tabIndex} index={0}>
              <Dashboard />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Transactions />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <Accounts />
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              <Settings />
            </TabPanel>
          </Grid>
        </Grid>
      </Main>
    </Root>
  );
}

export default Layout;
