import React from 'react';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../BoxFlexColumn';
import BoxFlexCenter from '../BoxFlexCenter';

export default function SubAccount(props) {
  const { item } = props;

  const amount = 'amount' in item ? item.amount : item.value;
  return (
    <>
      <BoxFlexColumn alignItems='space-between'>
        <Typography
          variant='body1'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.name}
        </Typography>
      </BoxFlexColumn>
      <BoxFlexCenter>
        <Typography variant='body1' color='textSecondary'>
          $
        </Typography>
        <Typography variant='h6' color='white' fontWeight='bold'>
          {_numberToCurrency.format(amount)}
        </Typography>
      </BoxFlexCenter>
    </>
  );
}
