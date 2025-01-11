import React from 'react';
import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

import BoxFlexColumn from '../BoxFlexColumn';
import BoxFlexCenter from '../BoxFlexCenter';

const numberToValue = (value) => {
  if (value < 1)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(value);
  else if (value < 100)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function AssetTransaction(props) {
  const { transaction } = props;
  return (
    <>
      <BoxFlexColumn alignItems='space-between'>
        <Typography variant='body2' color='textSecondary'>
          {dayjs(transaction.date).format('MMM Do, YYYY')}
        </Typography>
        <BoxFlexCenter justifyContent='flex-start'>
          <Typography variant='h6' color='textSecondary'>
            $
          </Typography>
          <Typography variant='h5' fontWeight='bold'>
            {numberToValue(transaction.amount + (transaction?.fee || 0))}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
      <BoxFlexColumn alignItems='space-between'>
        <BoxFlexCenter>
          <Typography variant='body2' color='textSecondary'>
            $
          </Typography>
          <Typography variant='body1' fontWeight='bold'>
            {numberToValue(transaction.price)}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body2' color='textSecondary'>
          price
        </Typography>
      </BoxFlexColumn>
      <BoxFlexColumn alignItems='space-between'>
        <Typography
          variant='body1'
          fontWeight='bold'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {numberToValue(transaction.shares)}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          shares
        </Typography>
      </BoxFlexColumn>
    </>
  );
}
