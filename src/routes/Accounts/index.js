import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../store/user';
import { openDialog } from '../../store/dialogs';
import AccountsCharts from './Charts';
import AccountsStack from './AccountsStack';
import AssetsStack from './AssetsStack';
import DebtsStack from './DebtsStack';
import CustomToggleButton from '../../components/CustomToggleButton';
import PullToRefresh from '../../components/PullToRefresh';
import CustomAppBar from '../../components/CustomAppBar';
import CreateButton from '../../components/CustomAppBar/CreateButton';
import { useLocation } from 'react-router-dom';

export const ACCOUNTS = 'accounts';
export const ASSETS = 'assets';
export const DEBTS = 'debts';

export default function Accounts() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [tab, setTab] = useState(ACCOUNTS);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    const _tab = location.pathname.split('/')[2];
    if (_tab) {
      setTab(_tab);
    } else {
      setTab(ACCOUNTS);
    }
  }, [location.pathname]);

  const handleChangeTab = (event, newTab) => {
    dispatch(push(`/accounts/${newTab}`));
  };

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            accounts
          </Typography>
        }
        right={
          <CreateButton
            handleClick={() =>
              dispatch(openDialog({ type: 'account', mode: 'create' }))
            }
          />
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />
        <AccountsCharts />
        <Grid item xs={12} display='flex' justifyContent='center'>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
            sx={{ px: 1 }}
          >
            <CustomToggleButton value={ACCOUNTS}>{ACCOUNTS}</CustomToggleButton>
            <CustomToggleButton value={ASSETS}>{ASSETS}</CustomToggleButton>
            <CustomToggleButton value={DEBTS}>{DEBTS}</CustomToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {tab === ACCOUNTS && <AccountsStack />}
        {tab === ASSETS && <AssetsStack />}
        {tab === DEBTS && <DebtsStack />}

        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
