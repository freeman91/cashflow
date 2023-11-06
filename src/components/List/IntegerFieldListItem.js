import React from 'react';

import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

export const IntegerFieldListItem = (props) => {
  return (
    <ListItem sx={{ pl: 0, pr: 0 }}>
      <TextField type='number' fullWidth variant='standard' {...props} />
    </ListItem>
  );
};
