import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import find from 'lodash/find';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { openDialog } from '../../store/dialogs';
import { saveNetworth } from '../../store/networths';
import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';
import AccountsStack from './AccountsStack';
import AccountPage from './AccountPage';
import CurrentNetworth from '../Networth/CurrentNetworth';

export default function Accounts() {
  const dispatch = useDispatch();
  const location = useLocation();
  const accounts = useSelector((state) => state.accounts.data);

  let accountId = location.pathname.replace('/accounts', '');
  accountId = accountId.replace('/', '');
  const [account, setAccount] = useState(null);

  useEffect(() => {
    dispatch(
      setAppBar({
        leftAction: <BackButton />,
        rightAction: account ? (
          <Card raised>
            <IconButton
              onClick={() =>
                dispatch(
                  openDialog({
                    type: 'account',
                    mode: 'edit',
                    id: account.account_id,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Card>
        ) : (
          <Stack spacing={1} direction='row'>
            <Card raised>
              <IconButton
                color='primary'
                onClick={() => dispatch(saveNetworth())}
              >
                <SaveIcon />
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
          </Stack>
        ),
      })
    );
  }, [dispatch, account]);

  useEffect(() => {
    if (accountId) {
      let _account = find(accounts, { account_id: accountId });
      setAccount(_account);
    } else {
      setAccount(null);
    }
  }, [accounts, accountId]);

  const renderComponent = () => {
    if (account) {
      return <AccountPage account={account} />;
    }
    return <AccountsStack />;
  };

  if (accountId && !account) return null;
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
        {!account && <CurrentNetworth showItems={false} />}
        {renderComponent()}
      </Grid>
    </Box>
  );
}
