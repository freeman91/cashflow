import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import TextFieldListItem from './TextFieldListItem';

const ContributionListItem = (props) => {
  const { label, attributes, onChange } = props;

  const allAccounts = useSelector((state) => state.accounts.data);
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState(allAccounts);

  useEffect(() => {
    const _accounts = allAccounts.filter(
      (account) => account.account_type === 'Asset'
    );
    setAccounts(_accounts);
  }, [allAccounts]);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    onChange(id, value);
  };

  const employee = attributes?.employee || '';
  const employer = attributes?.employer || '';
  const account_id = attributes?.account_id || '';

  return (
    <>
      <ListItemButton sx={{ borderRadius: 1 }} onClick={handleClick}>
        <ListItemText primary={label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding sx={{ pl: 4 }}>
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
            onChange={(e) => handleChange('employee', e.target.value)}
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
            onChange={(e) => handleChange('employer', e.target.value)}
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
      </Collapse>
    </>
  );
};

export default ContributionListItem;
