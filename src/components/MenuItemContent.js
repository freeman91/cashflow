import React from 'react';

import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';

export default function MenuItemContent({ name, sum, subheader, indent = 0 }) {
  return (
    <ListItemText
      primary={name}
      secondary={
        <BoxFlexCenter justifyContent='flex-start'>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h6' color='white' fontWeight='bold'>
            {_numberToCurrency.format(sum)}
          </Typography>
        </BoxFlexCenter>
      }
      primaryTypographyProps={{ variant: 'h6' }}
      secondaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
    />
  );
}
