import React from 'react';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function DebtCard({ debt }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openDialog({ type: debt._type, mode: 'edit', id: debt.debt_id }));
  };

  return (
    <Card
      sx={{ width: '100%', cursor: 'pointer' }}
      raised
      onClick={() => handleClick()}
      key={debt.debt_id}
    >
      <CardHeader
        title={debt.name}
        subheader={debt.description}
        titleTypographyProps={{ align: 'left' }}
        subheaderTypographyProps={{ align: 'left' }}
        sx={{
          '.MuiCardHeader-action': { alignSelf: 'center' },
        }}
        action={
          <Stack
            direction='row'
            mr={2}
            spacing={0}
            alignItems='center'
            justifyContent='flex-end'
          >
            <Typography align='center'>
              {numberToCurrency.format(debt.value)}
            </Typography>
          </Stack>
        }
      />
    </Card>
  );
}
