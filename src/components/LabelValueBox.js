import React from 'react';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';

export default function LabelValueBox(props) {
  const { value, label } = props;
  return (
    <BoxFlexCenter sx={{ flexGrow: 1 }} justifyContent='space-between'>
      <Typography
        variant='h6'
        color='text.secondary'
        align='center'
        fontWeight='bold'
      >
        {label}
      </Typography>
      <BoxFlexCenter>
        <Typography variant='h6' color='text.secondary'>
          $
        </Typography>
        <Typography variant='h5' color='white' fontWeight='bold'>
          {_numberToCurrency.format(value)}
        </Typography>
      </BoxFlexCenter>
    </BoxFlexCenter>
  );
}
