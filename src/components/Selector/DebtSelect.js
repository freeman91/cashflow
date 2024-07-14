import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { sortBy } from 'lodash';

function DebtSelect(props) {
  const { resource, setResource } = props;

  const debts = useSelector((state) => state.debts.data);

  const handleChangeDebt = (e) => {
    if (e.target.value === '') return;
    setResource({ ...resource, debt_id: e.target.value });
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='debt-label'>debt</InputLabel>
      <Select
        disabled
        labelId='debt-label'
        id='item_id'
        value={get(resource, 'debt_id', '')}
        onChange={handleChangeDebt}
        label='Debt'
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
        {sortBy(debts, 'name ').map((debt) => (
          <MenuItem
            key={debt.debt_id}
            id={`${debt.debt_id}-menu-item`}
            value={debt.debt_id}
          >
            {debt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DebtSelect;
