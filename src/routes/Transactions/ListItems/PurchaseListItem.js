import React from 'react';

import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../../helpers/currency';

export default function RepaymentListItem(props) {
  const { transaction } = props;

  return (<>
    <ListItemText
      primary={transaction.merchant}
      sx={{ width: '20%' }}
      slotProps={{
        primary: {
          sx: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }
      }}
    />
    <ListItemText
      primary={new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 5,
        minimumFractionDigits: 1,
      }).format(transaction.shares)}
      sx={{ width: '15%' }}
      slotProps={{
        primary: { align: 'right' }
      }}
    />
    <ListItemText
      primary={numberToCurrency.format(transaction.price)}
      sx={{ width: '15%' }}
      slotProps={{
        primary: { align: 'right' }
      }}
    />
  </>);
}
