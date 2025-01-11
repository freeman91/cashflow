import React from 'react';
import { useSelector } from 'react-redux';

import ListItemText from '@mui/material/ListItemText';

export default function BorrowListItem(props) {
  const { transaction } = props;

  const account = useSelector((state) =>
    state.accounts.data.find(
      (account) => account.account_id === transaction.account_id
    )
  );

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
      primary={account.name}
      sx={{ width: '15%' }}
      slotProps={{
        primary: { align: 'left' }
      }}
    />
  </>);
}
