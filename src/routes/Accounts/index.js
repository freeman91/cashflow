import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refresh } from '../../store/user';
import { openDialog } from '../../store/dialogs';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import AccountsNetworth from './Networth';
import AccountsStack from './AccountsStack';
import AssetsStack from './AssetsStack';
import DebtsStack from './DebtsStack';
import CustomAppBar from '../../components/CustomAppBar';
import CreateButton from '../../components/CustomAppBar/CreateButton';

export const ACCOUNTS = 'accounts';
export const ASSETS = 'assets';
export const DEBTS = 'debts';

const CustomToggleButton = (props) => {
  return <ToggleButton {...props} sx={{ py: 0.5, color: 'text.secondary' }} />;
};

export default function Accounts() {
  const dispatch = useDispatch();

  const [tab, setTab] = useState(ACCOUNTS);

  const onRefresh = async () => {
    dispatch(refresh());
  };
  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
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
        sx={{ pt: 1, mt: '42px' }}
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}
        <AccountsNetworth tab={tab} handleChangeTab={handleChangeTab} />
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
