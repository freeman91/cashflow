import React from 'react';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function RepaymentCard({ repayment }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({
        type: repayment?._type,
        mode: 'edit',
        id: repayment?.repayment_id,
      })
    );
  };

  return (
    <Card
      sx={{ width: '100%', cursor: 'pointer' }}
      raised
      onClick={() => handleClick()}
      key={repayment.repayment_id}
    >
      <CardHeader
        title={repayment.date.slice(0, 10)}
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
            spacing={0}
            alignItems='center'
            justifyContent='flex-end'
          >
            <Typography align='center'>
              {numberToCurrency.format(
                repayment.principal + repayment.interest
              )}
            </Typography>
          </Stack>
        }
      />
    </Card>
  );
}
