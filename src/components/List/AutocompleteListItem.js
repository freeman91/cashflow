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
          if (option === '') return '';
          return option;
        }}
        renderInput={(params) => (
          <TextField label={label} {...params} variant='standard' />
        )}
        options={_options}
        {...props}
        slotProps={{
          listbox: {
            sx: {
              bgcolor: 'surface.300',
              p: 0,
            },
          },
          paper: {
            sx: {
              minWidth: 'unset !important',
            },
          },
        }}
      />
    </ListItem>
  );
};

export default AutocompleteListItem;
