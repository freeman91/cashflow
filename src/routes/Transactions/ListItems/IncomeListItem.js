import React from 'react';
import { useSelector } from 'react-redux';
import ListItemText from '@mui/material/ListItemText';

export default function RepaymentListItem(props) {
  const { transaction, parentWidth } = props;

  const account = useSelector((state) =>
    state.accounts.data.find(
      (account) => account.account_id === transaction.deposit_to_id
    )
  );

  return (
    <>
      <ListItemText
        primary={transaction.source}
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
        primary={transaction.category}
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
        primary={account?.name}
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
