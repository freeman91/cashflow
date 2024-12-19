import React from 'react';

import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { numberToCurrency } from '../helpers/currency';

export default function MenuItemContent({ name, sum, subheader, indent = 0 }) {
  return (
    <>
      {/* <Typography variant='body1'>{name}</Typography> */}
      <ListItemText>{name}</ListItemText>
      {/* <ListItemText primary={name} /> */}
      {/* <Typography variant='h6' fontWeight='bold'>
        <Typography variant='h6' fontWeight='bold'>
        {numberToCurrency.format(sum)}
      </Typography> */}
      <ListItemText>
        <Typography variant='h6' fontWeight='bold' align='right'>
          {numberToCurrency.format(sum)}
        </Typography>
      </ListItemText>
      {/* <ListItemText
        primary={numberToCurrency.format(sum)}
        primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
      /> */}
    </>
  );
}
