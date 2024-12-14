import React from 'react';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function Account(props) {
  const { account } = props;

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
          {account.name}
        </Typography>
      </BoxFlexColumn>
      <BoxFlexCenter>
        <Typography variant='body1' color='text.secondary'>
          $
        </Typography>
        <Typography variant='h6' color='white' fontWeight='bold'>
          {_numberToCurrency.format(account.net)}
        </Typography>
      </BoxFlexCenter>
    </>
  );
}
