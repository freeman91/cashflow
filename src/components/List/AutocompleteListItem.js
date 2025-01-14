import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

const AutocompleteListItem = ({ label, ...props }) => {
  return (
    <ListItem disableGutters>
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
        slotProps={{
          listbox: { sx: { bgcolor: 'surface.300', p: 0 } },
        }}
      />
    </ListItem>
  );
};

export default AutocompleteListItem;
