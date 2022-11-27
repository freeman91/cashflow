import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map, sortBy } from 'lodash';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import AccountGrid from './AccountGrid';
import { openDialog } from '../../store/dialogs';

export default function Accounts() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.data);

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
    <Grid container spacing={3} sx={{ maxWidth: 1000 }}>
      {map(sortBy(accounts, 'name'), (account) => {
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
    </Grid>
  );
}
