import React from 'react';

import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

const TextFieldListItem = (props) => {
  return (
    <ListItem sx={{ pl: 0, pr: 0 }}>
      <TextField fullWidth variant='standard' {...props} />
    </ListItem>
  );
};

export default TextFieldListItem;
