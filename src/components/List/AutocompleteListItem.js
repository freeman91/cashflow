import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

const AutocompleteListItem = ({ label, options, ...props }) => {
  let _options = ['', ...options];
  return (
    <ListItem disableGutters>
      <Autocomplete
        fullWidth
        data-lpignore='true'
        autoComplete
        autoHighlight
        autoSelect
        freeSolo
        getOptionLabel={(option) => {
          if (option === '') return 'none';
          return option;
        }}
        renderInput={(params) => (
          <TextField label={label} {...params} fullWidth variant='standard' />
        )}
        options={_options}
        {...props}
        slotProps={{
          listbox: { sx: { bgcolor: 'surface.300', p: 0 } },
        }}
      />
    </ListItem>
  );
};

export default AutocompleteListItem;
