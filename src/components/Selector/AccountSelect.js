import React from 'react';
import { useSelector } from 'react-redux';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { sortBy } from 'lodash';

function AccountSelect(props) {
  const { resource, setResource } = props;

  const accounts = useSelector((state) => state.accounts.data);

  const handleChangeAccount = (e) => {
    if (e.target.value === '') return;
    setResource({ ...resource, account_id: e.target.value });
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='account-label'>account</InputLabel>
      <Select
        labelId='account-label'
        id='item_id'
        value={resource.account_id || ''}
        onChange={handleChangeAccount}
        label='Account'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {sortBy(accounts, 'name ').map((account) => (
          <MenuItem
            key={account.account_id}
            id={`${account.account_id}-menu-item`}
            value={account.account_id}
          >
            {account.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AccountSelect;
