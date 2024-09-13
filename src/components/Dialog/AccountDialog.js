import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextFieldListItem from '../List/TextFieldListItem';

import { deleteAccount, postAccount, putAccount } from '../../store/accounts';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';

export const CATEGORIES = ['bank', 'brokerage', 'property', 'credit'];

const defaultAccount = {
  account_id: '',
  name: '',
  url: '',
  account_type: 'bank',
  _type: 'account',
  description: '',
};

function AccountDialog() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.account);
  const [account, setAccount] = useState(defaultAccount);

  useEffect(() => {
    if (id) {
      let _account = find(accounts, { account_id: id });
      setAccount(_account);
    }
  }, [id, accounts]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setAccount((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postAccount(account));
    } else dispatch(putAccount(account));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteAccount(account.account_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('account'));
    setAccount(defaultAccount);
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultAccount._type}
      title={`${mode} ${defaultAccount._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='account_id'
              label='account_id'
              value={account.account_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <TextFieldListItem
            id='name'
            label='name'
            value={account.name}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='url'
            label='url'
            value={account.url}
            onChange={handleChange}
          />
          <ListItem disableGutters>
            <FormControl variant='standard' fullWidth>
              <InputLabel id='account_type-label'>account type</InputLabel>
              <Select
                labelId='account_type-label'
                id='account_type'
                value={account.account_type}
                onChange={(e) => {
                  setAccount((prevAccount) => ({
                    ...prevAccount,
                    account_type: e.target.value,
                  }));
                }}
              >
                {CATEGORIES.map((type) => (
                  <MenuItem key={type} value={type}>
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <TextFieldListItem
            id='description'
            label='description'
            value={account.description || ''}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
          />
          <ListItem
            key='buttons'
            disableGutters
            sx={{ justifyContent: 'space-around' }}
          >
            <Button
              onClick={handleClose}
              variant='outlined'
              color='info'
              sx={{ width: '45%' }}
            >
              cancel
            </Button>
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '45%' }}
            >
              submit
            </Button>
          </ListItem>
        </List>
      </form>
    </BaseDialog>
  );
}

export default AccountDialog;
