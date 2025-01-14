import React from 'react';
import { useSelector } from 'react-redux';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';

function DepositToSelect(props) {
  const { accountId, onChange } = props;

  const accounts = useSelector((state) => {
    let _accounts = state.accounts.data;
    return _accounts.filter((account) => account?.asset_type === 'Cash');
  });

  const handleChangeDepositTo = (e) => {
    onChange(e.target.value);
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='deposit_to-label'>deposit to</InputLabel>
      <Select
        labelId='deposit_to-label'
        id='deposit_to'
        value={accountId || ''}
        onChange={handleChangeDepositTo}
        label='Deposit To'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{
          MenuListProps: {
            disablePadding: true,
            sx: { bgcolor: 'surface.300' },
          },
        }}
      >
        <MenuItem key='none' id='none-menu-item' value=''>
          None
        </MenuItem>
        {accounts.map((account) => (
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

export default DepositToSelect;
