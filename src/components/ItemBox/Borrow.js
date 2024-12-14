import React from 'react';
import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../BoxFlexCenter';
import BoxFlexColumn from '../BoxFlexColumn';

export default function Borrow(props) {
  const { transaction } = props;

  return (
    <>
      <BoxFlexColumn alignItems='space-between'>
        <Typography
          variant='h6'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {transaction.lender}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          lender
        </Typography>
      </BoxFlexColumn>
      <BoxFlexColumn alignItems='space-between'>
        <Typography align='right' variant='body2' color='text.secondary'>
          {dayjs(transaction.date).format('MMM D, YYYY')}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='body1' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h6' fontWeight='bold'>
            {_numberToCurrency.format(transaction.amount)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
    </>
  );
}
