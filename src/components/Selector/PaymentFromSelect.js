import React from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';

function PaymentFromSelect(props) {
  const { resource, setResource } = props;

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

  const handleChangeDebt = (e) => {
    setResource((prevResource) => ({
      ...prevResource,
      payment_from_id: e.target.value,
    }));
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='payment_from-label'>payment from</InputLabel>
      <Select
        labelId='payment_from-label'
        id='payment_from'
        value={get(resource, 'payment_from_id', '')}
        onChange={handleChangeDebt}
        label='Debt'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{
          MenuListProps: {
            sx: { bgcolor: 'surface.300' },
          },
        }}
      >
        <MenuItem key='none' id='none-menu-item' value=''>
          None
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
