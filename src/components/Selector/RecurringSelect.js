import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { sortBy } from 'lodash';

function RecurringSelect(props) {
  const { resource, setResource } = props;

  const recurrings = useSelector((state) => state.recurrings.data);

  const handleChangeRecurring = (e) => {
    setResource({ ...resource, recurring_id: e.target.value });
  };

  return (
    <FormControl
      variant='standard'
      sx={{ width: '100%', maxWidth: 350, display: 'flex' }}
    >
      <InputLabel id='recurring-label'>recurring</InputLabel>
      <Select
        labelId='recurring-label'
        id='item_id'
        value={get(resource, 'recurring_id', '')}
        onChange={handleChangeRecurring}
        label='Recurring'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <MenuItem key='none' id={`none-menu-item`} value={''}>
          None
        </MenuItem>
        {sortBy(recurrings, 'name ').map((recurring) => (
          <MenuItem
            key={recurring.recurring_id}
            id={`${recurring.recurring_id}-menu-item`}
            value={recurring.recurring_id}
          >
            {recurring.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default RecurringSelect;
