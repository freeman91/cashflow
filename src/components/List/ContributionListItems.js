import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import TextFieldListItem from './TextFieldListItem';

const ContributionListItems = (props) => {
  const { paycheck, setPaycheck, attr } = props;

  const allAccounts = useSelector((state) => state.accounts.data);
  const [accounts, setAccounts] = useState(allAccounts);

  useEffect(() => {
    const _accounts = allAccounts.filter(
      (account) => account.account_type === 'Asset'
    );
    setAccounts(_accounts);
  }, [allAccounts]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    const attrValues = get(paycheck, attr, {});
    setPaycheck((prevPaycheck) => ({
      ...prevPaycheck,
      [attr]: { ...attrValues, [id]: value },
    }));
  };

  const employee = get(paycheck, `${attr}.employee`, '');
  const employer = get(paycheck, `${attr}.employer`, '');
  const account_id = get(paycheck, `${attr}.account_id`, '');

  return (
    <ListItem>
      <List disablePadding sx={{ width: '100%' }}>
        <ListItemText
          primary={attr.replace('_', ' ')}
          primaryTypographyProps={{ align: 'center' }}
        />
        <ListItem disableGutters>
          <FormControl variant='standard' fullWidth>
            <InputLabel id='account-label'>Account</InputLabel>
            <Select
              labelId='account-label'
              id='account_id'
              value={account_id || ''}
              onChange={handleChange}
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
        </ListItem>
        <TextFieldListItem
          id='employee'
          label='employee'
          placeholder='0.00'
          value={employee || ''}
          onChange={handleChange}
          inputProps={{ inputMode: 'decimal' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextFieldListItem
          id='employer'
          label='employer'
          placeholder='0.00'
          value={employer || ''}
          onChange={handleChange}
          inputProps={{ inputMode: 'decimal' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
      </List>
    </ListItem>
  );
};

export default ContributionListItems;
