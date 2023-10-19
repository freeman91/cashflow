import React from 'react';

import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

export const TextFieldListItem = (props) => {
  return (
    <ListItem>
      <TextField fullWidth variant='standard' {...props} />
    </ListItem>
  );
};
