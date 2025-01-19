import React from 'react';

import ListItemText from '@mui/material/ListItemText';

export default function RecurringListItem(props) {
  const { transaction, parentWidth } = props;

  return (
    <>
      <ListItemText
        primary={transaction.name}
        sx={{
          maxWidth: 250,
          flex: 1,
        }}
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
        primary={transaction.item_type}
        sx={{
          flex: 1,
          display: parentWidth < 600 ? 'none' : 'block',
        }}
        slotProps={{
          primary: {
            align: 'left',
          },
        }}
      />
    </>
  );
}
