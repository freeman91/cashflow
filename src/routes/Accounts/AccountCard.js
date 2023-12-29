import React from 'react';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';

import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function AccountCard({ account }) {
  const dispatch = useDispatch();

  const handleClick = (account) => {
    dispatch(push(`/app/accounts/${account.account_id}`));
  };

  return (
    <Card sx={{ width: '100%' }} raised key={account.account_id}>
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
              {numberToCurrency.format(account.net)}
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
            <IconButton color='primary' onClick={() => handleClick(account)}>
              <ListIcon />
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
}
