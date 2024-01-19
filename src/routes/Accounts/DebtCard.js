import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import find from 'lodash/find';

import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function DebtCard({ debt }) {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.data);
  const [account, setAccount] = useState({});

  useEffect(() => {
    setAccount(find(accounts, { account_id: debt.account_id }));
  }, [accounts, debt.account_id]);

  const handleClick = () => {
    dispatch(push(`/app/debts/${debt.debt_id}`));
  };

  return (
    <Card sx={{ width: '100%' }} raised key={debt.debt_id}>
      <CardHeader
        title={debt.name}
        subheader={account.name}
        titleTypographyProps={{ align: 'left' }}
        subheaderTypographyProps={{ align: 'left' }}
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
          >
            <Typography align='center'>
              {numberToCurrency.format(debt.amount)}
            </Typography>
            <IconButton
              color='primary'
              onClick={() =>
                dispatch(
                  openDialog({
                    type: 'debt',
                    mode: 'edit',
                    attrs: debt,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
            <IconButton color='primary' onClick={() => handleClick()}>
              <ListIcon />
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
}
