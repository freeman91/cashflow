import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

export const AutocompleteListItem = ({ label, ...props }) => {
  return (
    <ListItem>
      <Autocomplete
        fullWidth
        data-lpignore='true'
        autoComplete
        autoHighlight
        autoSelect
        freeSolo
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField label={label} {...params} fullWidth variant='standard' />
        )}
        {...props}
      />
    </ListItem>
  );
};
