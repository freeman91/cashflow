import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function StringFilter(props) {
  const { disabled, label, stringFilter, setStringFilter, options } = props;

  const handleChange = (event) => {
    setStringFilter(event.target.innerText);
  };

  return (
    <Autocomplete
      disabled={disabled}
      id={label}
      label={label}
      data-lpignore='true'
      autoComplete
      autoHighlight
      autoSelect
      freeSolo
      getOptionLabel={(option) => option}
      options={options}
      renderInput={(params) => {
        params.inputProps.value = stringFilter;
        return (
          <TextField
            {...params}
            disabled={disabled}
            id={label}
            label={label}
            variant='standard'
            value={stringFilter}
            onChange={handleChange}
          />
        );
      }}
      onChange={handleChange}
      sx={{ width: '100%', maxWidth: 350 }}
    />
  );
}
