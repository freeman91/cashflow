import React from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function PaymentFromSelect(props) {
  const { accountId, onChange } = props;

  const [cashAccounts, creditAccounts] = useSelector((state) => {
    let _accounts = state.accounts.data;
    let cashAccounts = filter(_accounts, (account) => {
      return account.asset_type === 'Cash';
    });
    let creditAccounts = filter(_accounts, (account) => {
      return account.liability_type === 'Credit';
    });
    return [sortBy(cashAccounts, 'name'), sortBy(creditAccounts, 'name')];
  });

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='payment_from-label'>payment from</InputLabel>
      <Select
        labelId='payment_from-label'
        id='payment_from'
        value={accountId || ''}
        onChange={handleChange}
        label='Debt'
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
        <MenuItem key='none' value=''>
          <em>None</em>
        </MenuItem>
        <Divider sx={{ mx: 1 }} />
        {creditAccounts.map((account) => (
          <MenuItem
            key={account.account_id}
            id={`${account.account_id}-menu-item`}
            value={account.account_id}
          >
            {account.name}
          </MenuItem>
        ))}
        <Divider sx={{ mx: 1 }} />
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

export default PaymentFromSelect;
