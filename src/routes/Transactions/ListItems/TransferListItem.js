import React from 'react';

import ListItemText from '@mui/material/ListItemText';

export default function TransferListItem(props) {
  const { transaction } = props;

  console.log('transaction: ', transaction);

  return (
    <>
      <ListItemText primary='From' sx={{ width: '15%' }} />
      <ListItemText primary='To' sx={{ width: '15%' }} />
    </>
  );
}
