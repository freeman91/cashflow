import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function PaycheckTemplateSelect(props) {
  const { selected, handleSelect } = props;

  const paycheckTemplates = useSelector((state) => {
    return state.recurring.data.filter(
      (recurring) => recurring.item_type === 'paycheck'
    );
  });
  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='recurring_id-label'>paycheck template</InputLabel>
      <Select
        labelId='recurring_id-label'
        id='recurring_id'
        value={get(selected, 'recurring_id', '')}
        onChange={handleSelect}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{ MenuListProps: { disablePadding: true } }}
      >
        <MenuItem key='none' id='none-menu-item' value=''>
          none
        </MenuItem>
        {paycheckTemplates.map((paycheck) => (
          <MenuItem
            key={paycheck.recurring_id}
            id={`${paycheck.recurring_id}-menu-item`}
            value={paycheck.recurring_id}
          >
            {paycheck.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PaycheckTemplateSelect;
