import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import map from 'lodash/map';

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
      renderInput={(params) => (
        <TextField
          disabled={disabled}
          id={label}
          label={label}
          variant='standard'
          value={stringFilter}
          onChange={handleChange}
          {...params}
        />
      )}
      onChange={handleChange}
      sx={{ width: '100%', maxWidth: 350 }}
    />
  );
}
