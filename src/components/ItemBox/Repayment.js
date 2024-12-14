import React from 'react';
import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../BoxFlexCenter';
import BoxFlexColumn from '../BoxFlexColumn';

export default function Repayment(props) {
  const { transaction } = props;

  return (
    <>
      <BoxFlexColumn alignItems='space-between'>
        <Typography align='left' variant='body2' color='text.secondary'>
          {dayjs(transaction.date).format('MMM Do, YYYY')}{' '}
          {transaction.pending && '(pending)'}
        </Typography>
        <BoxFlexCenter justifyContent='flex-start'>
          <Typography variant='h5' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' fontWeight='bold'>
            {_numberToCurrency.format(
              transaction.principal +
                transaction.interest +
                (transaction.escrow ? transaction.escrow : 0)
            )}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
      <BoxFlexColumn alignItems='space-between'>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h6' fontWeight='bold'>
            {_numberToCurrency.format(transaction.principal)}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body2' color='text.secondary'>
          principal
        </Typography>
      </BoxFlexColumn>
      <BoxFlexColumn alignItems='space-between'>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h6' fontWeight='bold'>
            {_numberToCurrency.format(transaction.interest)}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body2' color='text.secondary'>
          interest
        </Typography>
      </BoxFlexColumn>
    </>
  );
}
