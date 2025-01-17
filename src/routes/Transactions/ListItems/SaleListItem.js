import React from 'react';

import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../../helpers/currency';

export default function RepaymentListItem(props) {
  const { transaction, parentWidth } = props;

  return (
    <>
      <ListItemText
        primary={transaction.merchant}
        sx={{ maxWidth: 250, flex: 1 }}
        slotProps={{
          primary: {
            sx: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
        }}
      />
      <ListItemText
        primary={new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 5,
          minimumFractionDigits: 1,
        }).format(transaction.shares)}
        sx={{
          maxWidth: 250,
          flex: 1,
          display: parentWidth < 600 ? 'none' : 'block',
        }}
        slotProps={{
          primary: { align: 'left' },
        }}
      />
      <ListItemText
        primary={numberToCurrency.format(transaction.price)}
        sx={{
          maxWidth: 250,
          flex: 1,
          display: parentWidth < 900 ? 'none' : 'block',
        }}
        slotProps={{
          primary: { align: 'left' },
        }}
      />
    </>
  );
}
