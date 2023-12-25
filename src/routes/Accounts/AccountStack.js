import React, { useEffect, useState } from 'react';
import { push } from 'redux-first-history';
import { useDispatch, useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import map from 'lodash/map';

import { useTheme } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { ACCOUNT_TYPES } from '../../components/Dialog/AccountDialog';
import { openDialog } from '../../store/dialogs';

function AccountCard({ account }) {
  const dispatch = useDispatch();
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);
  const [assets, setAssets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setAssets(filter(allAssets, { account_id: account.account_id }));
  }, [account.account_id, allAssets]);

  useEffect(() => {
    setDebts(filter(allDebts, { account_id: account.account_id }));
  }, [account.account_id, allDebts]);

  useEffect(() => {
    const assetSum = assets.reduce((sum, asset) => sum + asset.value, 0);
    const debtSum = debts.reduce((sum, debt) => sum + debt.value, 0);
    setValue(assetSum - debtSum);
  }, [assets, debts]);

  const handleClick = (account) => {
    dispatch(push(`/app/accounts/${account.account_id}`));
  };

  return (
    <Card
      sx={{ width: '100%', cursor: 'pointer' }}
      raised
      onClick={() => handleClick(account)}
      key={account.account_id}
    >
      <CardHeader
        title={account.name}
        subheader={account.description}
        titleTypographyProps={{ align: 'left', width: '15rem' }}
        sx={{
          '.MuiCardHeader-action': { alignSelf: 'center' },
          p: 1,
          pl: 2,
          pr: 2,
        }}
        action={
          <Stack
            direction='row'
            mr={2}
            spacing={2}
            alignItems='center'
            justifyContent='space-between'
            sx={{ width: '100%' }}
          >
            <Typography align='center'>
              {numberToCurrency.format(value)}
            </Typography>
            <IconButton
              color='primary'
              onClick={() =>
                dispatch(
                  openDialog({
                    type: 'account',
                    mode: 'edit',
                    attrs: account,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
}

export default function AccountStack() {
  const theme = useTheme();
  const allAccounts = useSelector((state) => state.accounts.data);

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    setAccounts(groupBy(allAccounts, 'account_type'));
  }, [allAccounts]);

  const renderAccountsOfType = (type) => {
    return (
      <React.Fragment key={type}>
        <Typography key={type} align='left' sx={{ width: '100%' }}>
          {type}
        </Typography>
        {map(accounts[type], (account) => (
          <AccountCard key={account.account_id} account={account} />
        ))}
      </React.Fragment>
    );
  };

  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      spacing={1}
      padding={2}
      sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
    >
      {ACCOUNT_TYPES.map(renderAccountsOfType)}
    </Stack>
  );
}
