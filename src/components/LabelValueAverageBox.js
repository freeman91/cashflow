import React from 'react';

import Typography from '@mui/material/Typography';

import { _numberToCurrency, numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';
import BoxFlexColumn from './BoxFlexColumn';

export default function LabelValueAverageBox(props) {
  const { value, label, divisor } = props;

  return (
    <BoxFlexCenter sx={{ flexGrow: 1 }} justifyContent='space-between'>
      <Typography variant='h6' align='center'>
        {label}
      </Typography>
      <BoxFlexColumn sx={{ alignItems: 'center' }}>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h6' color='white' fontWeight='bold'>
            {_numberToCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body1' color='text.secondary'>
          {divisor > 1 && `${numberToCurrency.format(value / divisor)}`}
        </Typography>
      </BoxFlexColumn>
    </BoxFlexCenter>
  );
}
