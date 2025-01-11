import React from 'react';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function Bill(props) {
  const { bill } = props;

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
          {bill.name}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {bill.category}
        </Typography>
      </BoxFlexColumn>
      <BoxFlexColumn alignItems='space-between'>
        <Typography align='right' variant='body2' color='textSecondary'>
          {bill?.nextBillDate?.format('MMM Do, YYYY') || ''}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h5' color='textSecondary'>
            $
          </Typography>
          <Typography variant='h5' fontWeight='bold'>
            {_numberToCurrency.format(bill.amount)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
    </>
  );
}
