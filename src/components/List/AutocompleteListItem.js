import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

const AutocompleteListItem = ({ label, ...props }) => {
  return (
    <ListItem sx={{ pl: 0, pr: 0 }}>
      <Autocomplete
        fullWidth
        data-lpignore='true'
        autoComplete
        autoHighlight
        autoSelect
        freeSolo
        getOptionLabel={(option) => option}
        ListboxProps={{ sx: { bgcolor: 'surface.300' } }}
        renderInput={(params) => (
          <TextField label={label} {...params} fullWidth variant='standard' />
        )}
        {...props}
      />
    </ListItem>
  );
};

export default AutocompleteListItem;
