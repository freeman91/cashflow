import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';

function DepositToSelect(props) {
  const { accountId, onChange } = props;
  const allAccounts = useSelector((state) => state.accounts.data);

  const [cashAccounts, setCashAccounts] = useState([]);

  useEffect(() => {
    setCashAccounts(
      allAccounts.filter((account) => account?.asset_type === 'Cash')
    );
  }, [allAccounts]);

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
            sx: {
              bgcolor: 'surface.300',
              '& .MuiPaper-root': { minWidth: 'unset' },
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
      >
        <MenuItem key='none' id='none-menu-item' value=''>
          <em>None</em>
        </MenuItem>
        {cashAccounts.map((account) => (
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
