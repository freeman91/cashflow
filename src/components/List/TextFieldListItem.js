import React from 'react';

import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

const TextFieldListItem = (props) => {
  return (
    <ListItem disableGutters>
      <TextField fullWidth variant='standard' {...props} />
    </ListItem>
  );
};

export default TextFieldListItem;
