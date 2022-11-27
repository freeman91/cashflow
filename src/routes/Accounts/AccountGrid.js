import React, { useEffect, useState } from 'react';

import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { numberToCurrency } from '../../helpers/currency';
import { filter, get, reduce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from '../../store/dialogs';

export default function AccountGrid({ account }) {
  const dispatch = useDispatch();
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [assets, setAssets] = useState([]);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    setAssets(filter(allAssets, { account_id: account.id }));
    setDebts(filter(allDebts, { account_id: account.id }));
  }, [account, allAssets, allDebts]);

  const assetSum = reduce(
    assets,
    (acc, asset) => {
      return acc + get(asset, 'value', 0);
    },
    0
  );

  const debtSum = reduce(
    debts,
    (acc, debt) => {
      return acc + get(debt, 'value', 0);
    },
    0
  );

  const handleClickConfig = () => {
    dispatch(openDialog({ mode: 'update', attrs: account }));
  };

  const handleClick = (type) => {
    dispatch(openDialog({ mode: type, attrs: account }));
  };

  return (
    <Grid item xs={4}>
      <Card>
        <CardHeader
          title={account.name}
          subheader={numberToCurrency.format(assetSum - debtSum)}
          titleTypographyProps={{
            color: 'primary',
            sx: {
              align: 'left',
            },
          }}
          action={
            <Stack direction='row'>
              <Stack sx={{ minWidth: 40, minHeight: 80 }}>
                {assets.length ? (
                  <Tooltip title='Assets' placement='left'>
                    <IconButton
                      color='primary'
                      onClick={() => handleClick('assets')}
                    >
                      <LocalAtmIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
                {debts.length ? (
                  <Tooltip title='Debts' placement='left'>
                    <IconButton
                      color='primary'
                      onClick={() => handleClick('debts')}
                    >
                      <PaymentIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Stack>
              <Stack>
                <Tooltip title='Config' placement='right'>
                  <IconButton color='primary' onClick={handleClickConfig}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                {!account.url ? null : (
                  <Tooltip title='Open Link' placement='right'>
                    <IconButton
                      disabled={!account.url}
                      color='primary'
                      onClick={() => window.open(account.url, '_blank')}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          }
        />
      </Card>
    </Grid>
  );
}
