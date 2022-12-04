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
import Sidebar from '../../components/Sidebar';
import CreateDialog from '../../components/Dialog/CreateDialog';
import UpdateDialog from '../../components/Dialog/UpdateDialog';
import AssetsDialog from '../../components/Dialog/AssetsDialog';
import DebtsDialog from '../../components/Dialog/DebtsDialog';
import { getBills } from '../../store/bills';

const Root = styled('div')({
  display: 'flex',
  height: '100%',
  width: '99vw',
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
      style={{ width: '100%' }}
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
    dispatch(getBills());
    dispatch(getIncomes());
    dispatch(getAssets());
    dispatch(getDebts());
    dispatch(getNetworths());
    dispatch(getAccounts());
    /* eslint-disable-next-line */
  }, []);

  const handleChange = (e, idx) => {
    setTabIndex(idx);
  };

  return (
    <Root>
      <CssBaseline />
      <Main>
        <AppBar position='static' color='default'>
          <Toolbar sx={{ ml: 40 }}>
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <Sidebar />
          <Grid container spacing={1} p={2}>
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
        </div>

        <AssetsDialog />
        <DebtsDialog />
        <CreateDialog />
        <UpdateDialog />
      </Main>
    </Root>
  );
}

export default Layout;
