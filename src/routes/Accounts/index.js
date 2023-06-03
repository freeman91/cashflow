import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter, get, map, reduce, sortBy } from 'lodash';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import AccountGrid from './AccountGrid';
import { openDialog } from '../../store/dialogs';
import AssetsBarChart from './AssetsBarChart';
import NetWorthsChart from './NetWorthsChart';
import DebtsBarChart from './DebtsBarChart';

export default function Accounts() {
  const dispatch = useDispatch();
  const allAccounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    const _sum = (items) =>
      reduce(
        items,
        (acc, item) => {
          return acc + get(item, 'value', 0);
        },
        0
      );

    if (allAccounts && allAssets && allDebts) {
      let _accounts = map(sortBy(allAccounts), (account) => {
        let assets = filter(allAssets, { account_id: account.id });
        let debts = filter(allDebts, { account_id: account.id });
        let aSum = _sum(assets);
        let dSum = _sum(debts);

        return { ...account, equity: aSum - dSum };
      });

      let pAccounts = filter(_accounts, (account) => account.equity > 0);
      let nAccounts = filter(_accounts, (account) => account.equity < 0);
      let zAccounts = filter(_accounts, (account) => account.equity === 0);

      setAccounts([...pAccounts, ...nAccounts, ...zAccounts]);
    }
  }, [allAccounts, allAssets, allDebts]);

  const handleClick = () => {
    dispatch(
      openDialog({
        mode: 'create',
        attrs: {
          type: 'account',
        },
      })
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={3} sx={{ maxWidth: 1200 }}>
        {map(accounts, (account) => {
          return <AccountGrid key={account.id} account={account} />;
        })}
        <Grid item xs={12}>
          <Stack
            spacing={3}
            direction='row'
            alignItems='center'
            justifyContent='flex-end'
          >
            <Typography color='primary'>All Assets</Typography>
            <Typography color='primary'>All Debts</Typography>
            <Tooltip title='Create Account'>
              <IconButton onClick={handleClick}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>

        <NetWorthsChart />
        <AssetsBarChart />
        <DebtsBarChart />
      </Grid>
    </Box>
  );
}
