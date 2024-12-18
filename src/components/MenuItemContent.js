import React from 'react';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from '../components/BoxFlexCenter';
import BoxFlexColumn from '../components/BoxFlexColumn';

export default function MenuItemContent({ name, sum, subheader, indent }) {
  return (
    <BoxFlexCenter
      sx={{ flexGrow: 1, gap: 0.5 }}
      justifyContent='space-between'
    >
      <BoxFlexColumn sx={{ alignItems: 'flex-start', ml: indent * 2 }}>
        <Typography
          variant='h5'
          color='text.secondary'
          align='center'
          fontWeight={subheader ? 'bold' : 'normal'}
        >
          {name}
        </Typography>
      </BoxFlexColumn>

      <BoxFlexCenter>
        <Typography variant='h6' color='text.secondary'>
          $
        </Typography>
        <Typography variant='h5' color='white' fontWeight='bold'>
          {_numberToCurrency.format(sum)}
        </Typography>
      </BoxFlexCenter>
    </BoxFlexCenter>
  );
}
