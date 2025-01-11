import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';

import LoopIcon from '@mui/icons-material/Loop';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import { findAmount } from '../../helpers/transactions';
import { ASSET, LIABILITY } from '../../components/Dialog/AccountDialog';
import AccountsSummary from './Summary';
import AccountGroupGrid from './AccountGroupGrid';
import NetWorth from './Networth';

export default function AccountsRoot() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.data);

  const [groupedAccounts, setGroupedAccounts] = useState([]);

  useEffect(() => {
    const assetAccounts = accounts.filter(
      (account) => account.account_type === ASSET
    );
    const liabilityAccounts = accounts.filter(
      (account) => account.account_type === LIABILITY
    );

    let assetsGrouped = groupBy(assetAccounts, 'asset_type');
    let liabilitiesGrouped = groupBy(liabilityAccounts, 'liability_type');

    assetsGrouped = Object.entries(assetsGrouped).map(([type, items]) => {
      const groupAccounts = items.map((item) => ({
        ...item,
        _amount: findAmount(item),
      }));
      return {
        account_type: ASSET,
        type,
        sum: groupAccounts.reduce((acc, account) => acc + account._amount, 0),
        items: groupAccounts.sort((a, b) => b._amount - a._amount),
      };
    });
    assetsGrouped.sort((a, b) => b.sum - a.sum);

    liabilitiesGrouped = Object.entries(liabilitiesGrouped).map(
      ([type, items]) => {
        const groupAccounts = items.map((item) => ({
          ...item,
          _amount: findAmount(item),
        }));
        return {
          account_type: LIABILITY,
          type,
          sum: -groupAccounts.reduce(
            (acc, account) => acc + account._amount,
            0
          ),
          items: groupAccounts.sort((a, b) => b._amount - a._amount),
        };
      }
    );
    liabilitiesGrouped.sort((a, b) => b.sum + a.sum);

    setGroupedAccounts([...assetsGrouped, ...liabilitiesGrouped]);
  }, [accounts]);

  const createAccount = () => {
    dispatch(openDialog({ type: 'account', mode: 'create' }));
  };

  return (
    <>
      <Stack
        direction='row'
        spacing={1}
        mt={1.5}
        pl={2}
        pr={4}
        sx={{ width: '100%' }}
      >
        <Typography variant='h5' fontWeight='bold' sx={{ flexGrow: 1 }}>
          Accounts
        </Typography>
        <Button color='info' variant='contained' startIcon={<LoopIcon />}>
          Refresh
        </Button>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={createAccount}
        >
          Add Account
        </Button>
      </Stack>
      <Grid
        container
        spacing={2}
        px={2}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ width: '100%', mt: 1 }}
      >
        <NetWorth />
        <Grid size={{ xs: 8 }} display='flex' justifyContent='center'>
          <Grid container spacing={2}>
            {groupedAccounts.map((group, idx) => {
              const { type, sum, items } = group;
              return (
                <AccountGroupGrid
                  key={idx}
                  type={type}
                  sum={sum}
                  items={items}
                />
              );
            })}
          </Grid>
        </Grid>
        <AccountsSummary groupedAccounts={groupedAccounts} />
      </Grid>
      <Grid size={{ xs: 12 }} mb={5} />
    </>
  );
}
