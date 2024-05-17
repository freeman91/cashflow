import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import LaunchIcon from '@mui/icons-material/Launch';
import ListIcon from '@mui/icons-material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { numberToCurrency } from '../../../helpers/currency';

export default function AccountCard(props) {
  const { account } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(push('/app/accounts/' + account.account_id));
  };

  return (
    <Card raised>
      <CardHeader
        title={account.name}
        subheader={numberToCurrency.format(account.value)}
        action={
          <Stack direction='row'>
            <IconButton color='primary' onClick={handleClick}>
              <ListIcon />
            </IconButton>
            <IconButton
              color='primary'
              onClick={() => window.open(account.url, '_blank')}
            >
              <LaunchIcon />
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
}
