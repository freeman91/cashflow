import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { setAppBar } from '../../store/appSettings';
import { BackButton, SettingsButton } from '../Layout/CustomAppBar';
import NetworthChart from './NetworthChart';
import SelectedNetworth from './SelectedNetworth';
import CurrentNetworth from './CurrentNetworth';

export default function Networth() {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const networths = useSelector((state) => state.networths.data);

  useEffect(() => {
    dispatch(
      setAppBar({
        leftAction: <BackButton />,
        rightAction: (
          <Stack spacing={1} direction='row'>
            <Card raised>
              <IconButton onClick={() => dispatch(push('/accounts'))}>
                <AccountBalanceIcon />
              </IconButton>
            </Card>
            <Card raised>
              <IconButton onClick={() => dispatch(push('/assets'))}>
                <AccountBalanceWalletIcon />
              </IconButton>
            </Card>
            <Card raised>
              <IconButton onClick={() => dispatch(push('/debts'))}>
                <CreditCardIcon />
              </IconButton>
            </Card>
            <SettingsButton />
          </Stack>
        ),
      })
    );
  }, [dispatch]);

  const handleSelectPreviousMonth = () => {
    let networth;
    for (let i = 0; i <= networths.length - 1; i++) {
      if (!networth || networths[i].date > networth.date) {
        networth = networths[i];
      }
    }
    setSelectedId(networth.networth_id);
  };

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mb: 10 }}
      >
        <Grid item xs={12}>
          <NetworthChart
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </Grid>
        {selectedId ? (
          <SelectedNetworth
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        ) : (
          <CurrentNetworth
            handleSelectPreviousMonth={handleSelectPreviousMonth}
          />
        )}
      </Grid>
    </Box>
  );
}
