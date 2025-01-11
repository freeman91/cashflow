import React from 'react';

import ListItemText from '@mui/material/ListItemText';

export default function ExpenseListItem(props) {
  const { transaction, parentWidth } = props;

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
      primary={transaction.category}
      sx={{
        width: '15%',
        display: parentWidth < 600 ? 'none' : 'block',
      }}
      slotProps={{
        primary: { align: 'left' }
      }}
    />
    <ListItemText
      primary={transaction.subcategory}
      sx={{
        width: '15%',
        display: parentWidth < 1000 ? 'none' : 'block',
      }}
      slotProps={{
        primary: { align: 'left' }
      }}
    />
  </>);
}
