import React from 'react';

import ListItemText from '@mui/material/ListItemText';

export default function ExpenseListItem(props) {
  const { transaction, parentWidth } = props;

  return (
    <>
      <ListItemText
        primary={transaction.merchant}
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
        primary={transaction.category}
        sx={{
          maxWidth: 250,
          flex: 1,
          display: parentWidth < 600 ? 'none' : 'block',
        }}
        slotProps={{
          primary: {
            align: 'left',
          },
        }}
      />
      <ListItemText
        primary={transaction.subcategory}
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
