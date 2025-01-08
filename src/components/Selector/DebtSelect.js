import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { sortBy } from 'lodash';
import { LIABILITY } from '../Dialog/AccountDialog';

function LiabilitySelect(props) {
  const { mode, resource, setResource } = props;

  const liabilities = useSelector((state) =>
    state.accounts.data.filter((account) => account.account_type === LIABILITY)
  );

  const handleChangeDebt = (e) => {
    if (e.target.value === '') return;
    setResource({ ...resource, account_id: e.target.value });
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='liability-label'>liability</InputLabel>
      <Select
        disabled={mode === 'edit'}
        labelId='liability-label'
        id='liability-id'
        value={get(resource, 'account_id', '')}
        onChange={handleChangeDebt}
        label='Debt'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{ MenuListProps: { disablePadding: true } }}
      >
        <MenuItem key='none' id={`none-menu-item`} value=''>
          None
        </MenuItem>
        {sortBy(liabilities, 'name ').map((liability) => (
          <MenuItem
            key={liability.account_id}
            id={`${liability.account_id}-menu-item`}
            value={liability.account_id}
          >
            {liability.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LiabilitySelect;
