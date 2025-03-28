import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function SelectOption({ label, value, onChange, options = [] }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const sortedOptions = cloneDeep(options).sort();
  return (
    <ListItem disableGutters>
      <FormControl variant='standard' fullWidth>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-label`}
          value={value}
          onChange={handleChange}
          label={label}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: {
                bgcolor: 'surface.300',
                '& .MuiPaper-root': {
                  minWidth: 'unset',
                  borderRadius: 1,
                  overflow: 'hidden',
                },
              },
            },
            slotProps: {
              paper: {
                sx: {
                  minWidth: 'unset !important',
                },
              },
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
          <MenuItem value=''>
            <em>none</em>
          </MenuItem>
          {!sortedOptions.includes(value) && (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          )}
          {sortedOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  );
}
