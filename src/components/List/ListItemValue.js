import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../helpers/currency';

export const ListItemValue = (props) => {
  const { label, value, fontWeight = 'normal' } = props;
  return (
    <ListItem disableGutters disablePadding>
      <ListItemText
        secondary={label}
        secondaryTypographyProps={{ fontWeight }}
      />
      <ListItemText
        primary={numberToCurrency.format(value)}
        primaryTypographyProps={{ fontWeight, align: 'right' }}
      />
    </ListItem>
  );
};
