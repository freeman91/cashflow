import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const SelectOption = ({ value, onChange, options, label }) => {
  const handleChange = (e) => {
    onChange({ target: { id: label, value: e.target.value } });
  };

  const sortedOptions = cloneDeep(options).sort();
  return (
    <ListItem disableGutters>
      <FormControl variant='standard' fullWidth>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-label`}
          id={`${label}-id`}
          value={value}
          onChange={handleChange}
          label={label}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: { bgcolor: 'surface.300' },
            },
          }}
          sx={{
            backgroundColor: 'unset',
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <MenuItem value=''>none</MenuItem>
          {sortedOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  );
};

export default SelectOption;
