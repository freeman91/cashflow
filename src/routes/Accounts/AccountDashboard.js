import React, { useEffect, useState } from 'react';
import { push } from 'redux-first-history';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find';
import filter from 'lodash/filter';

import { useTheme } from '@mui/styles';
import BackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import AssetCard from './AssetCard';
import DebtCard from './DebtCard';
import { isEmpty } from 'lodash';

export default function AccountDashboard({ account_id }) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const accounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [assets, setAssets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [account, setAccount] = useState({});

  useEffect(() => {
    setAssets(filter(allAssets, { account_id }));
  }, [allAssets, account_id]);

  useEffect(() => {
    setDebts(filter(allDebts, { account_id }));
  }, [allDebts, account_id]);

  useEffect(() => {
    if (account_id) {
      let _account = find(accounts, { account_id: account_id });
      setAccount(_account);
    } else {
      setAccount({});
    }
  }, [accounts, account_id]);

  if (account_id && isEmpty(account)) return null;

  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      spacing={1}
      padding={2}
      sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '66%',
        }}
      >
        <Tooltip title='back' placement='left'>
          <IconButton
            color='primary'
            onClick={() => dispatch(push('/app/accounts'))}
          >
            <BackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant='h4' align='center' sx={{ width: '100%' }}>
          {account.name}
        </Typography>
        <Tooltip title='edit' placement='right'>
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
        </Tooltip>
      </div>

      {assets.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
      {assets.length > 0 && (
        <Typography sx={{ width: '100%' }} align='left'>
          assets
        </Typography>
      )}
      {assets.map((asset) => (
        <AssetCard key={asset.asset_id} asset={asset} />
      ))}

      {debts.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
      {debts.length > 0 && (
        <Typography sx={{ width: '100%' }} align='left'>
          debts
        </Typography>
      )}
      {debts.map((debt) => (
        <DebtCard key={debt.debt_id} debt={debt} />
      ))}
    </Stack>
  );
}
