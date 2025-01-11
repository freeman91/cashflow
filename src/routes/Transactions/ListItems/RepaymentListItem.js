import React from 'react';
import { useSelector } from 'react-redux';

import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../../helpers/currency';

export default function RepaymentListItem(props) {
  const { transaction, parentWidth } = props;

  const account = useSelector((state) =>
    state.accounts.data.find(
      (account) => account.account_id === transaction.account_id
    )
  );

  return (<>
    <ListItemText
      primary={transaction.merchant}
      sx={{ width: '15%' }}
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
      primary={account?.name}
      sx={{
        width: '15%',
        display: parentWidth < 600 ? 'none' : 'block',
      }}
      slotProps={{
        primary: { align: 'left' }
      }}
    />
    <ListItemText
      primary={numberToCurrency.format(transaction.principal)}
      sx={{
        width: '10%',
        display: parentWidth < 1000 ? 'none' : 'block',
      }}
      slotProps={{
        primary: { align: 'right' }
      }}
    />
    <ListItemText
      primary={numberToCurrency.format(transaction.interest)}
      sx={{
        width: '10%',
        display: parentWidth < 1000 ? 'none' : 'block',
      }}
      slotProps={{
        primary: { align: 'right' }
      }}
    />
  </>);
}
