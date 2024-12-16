import React from 'react';

import Typography from '@mui/material/Typography';

import BoxFlexCenter from './BoxFlexCenter';
import { _numberToCurrency } from '../helpers/currency';
import BoxFlexColumn from './BoxFlexColumn';

export default function LabelValueBox(props) {
  const { value, label, onClick = () => {}, textSize = 'large' } = props;

  const textVariant1 = textSize === 'large' ? 'h6' : 'body1';
  const textVariant2 = textSize === 'large' ? 'h5' : 'h6';
  return (
    <BoxFlexCenter
      sx={{ flexGrow: 1, gap: 0.5 }}
      justifyContent='space-between'
      onClick={onClick}
    >
      <BoxFlexColumn sx={{ alignItems: 'flex-start' }}>
        <Typography
          variant={textVariant1}
          color='text.secondary'
          align='center'
          fontWeight='bold'
        >
          {label}
        </Typography>
      </BoxFlexColumn>

      <BoxFlexCenter>
        <Typography variant={textVariant1} color='text.secondary'>
          $
        </Typography>
        <Typography variant={textVariant2} color='white' fontWeight='bold'>
          {_numberToCurrency.format(value)}
        </Typography>
      </BoxFlexCenter>
    </BoxFlexCenter>
  );
}
