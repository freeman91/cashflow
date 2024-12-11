import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function SummaryListItemValue(props) {
  const {
    value,
    label,
    gutters = false,
    textSize = 'large',
    onClick = null,
  } = props;

  const textVariant1 = textSize === 'large' ? 'h6' : 'body1';
  const textVariant2 = textSize === 'large' ? 'body1' : 'body2';

  return (
    <ListItem
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : 'inherit' }}
    >
      <ListItemText
        secondary={label}
        secondaryTypographyProps={{ variant: textVariant2 }}
        sx={{ pl: gutters ? 4 : 0 }}
      />
      <BoxFlexCenter sx={{ justifyContent: 'flex-end', pr: gutters ? 4 : 0 }}>
        <Typography variant={textVariant2} color='text.secondary'>
          $
        </Typography>
        <Typography variant={textVariant1} color='white' fontWeight='bold'>
          {_numberToCurrency.format(value)}
        </Typography>
      </BoxFlexCenter>
    </ListItem>
  );
}
