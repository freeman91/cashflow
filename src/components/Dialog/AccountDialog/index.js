import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {
  deleteAccount,
  postAccount,
  putAccount,
} from '../../../store/accounts';
import { closeDialog } from '../../../store/dialogs';
import BaseDialog from '..//BaseDialog';
import TextFieldListItem from '../../List/TextFieldListItem';

export const ASSET = 'Asset';
export const LIABILITY = 'Liability';
export const ACCOUNT_TYPES = [ASSET, LIABILITY];
export const ASSET_TYPES = {
  Cash: [
    'Checking', // balance
    'Savings', // balance
    'Digital Wallet', // amount
    'Physical Cash', // amount
    'Receivable', // amount
  ],
  'Real Estate': [
    'Primary Residence', // value
    'Rental Property', // value
    'Commercial Property', // value
    'Land', // value
  ],
  Vehicle: ['Personal', 'Recreation'], // value
  Investment: [
    'Brokerage', // value
    'Traditional 401(k)', // value
    'Roth 401(k)', // value
    'Traditional IRA', // value
    'Roth IRA', // value
    '403(b)', // value
    '457(b)', // value
    '529', // value
    'Pension', // value
  ],
  Valuables: ['Jewelry', 'Art', 'Collectibles', 'Electronics'], // value
  'Business Ownership': [
    'Sole Proprietorship', // value
    'Partnership', // value
    'LLC', // value
    'S-Corp', // value
    'C-Corp', // value
  ],
};
export const LIABILITY_TYPES = {
  Loan: ['Mortgage', 'Auto', 'Student', 'Personal', 'Business'], // amount
  Credit: ['Credit Card', 'Line of Credit'], // amount
};
export const numberAttributes = ['balance', 'amount', 'value'];

const defaultAccount = {
  account_id: '',
  name: '',
  institution: '',
  url: '',
  account_type: '',
  asset_type: '',
  liability_type: '',
  subtype: '',
  amount: '',
  value: '',
  balance: '',
  interest_rate: '',
  _type: 'account',
  description: '',
  icon_url: '',
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

  let subtypes = [];
  if (account.account_type === ASSET) {
    subtypes = ASSET_TYPES[account.asset_type];
  } else if (account.account_type === LIABILITY) {
    subtypes = LIABILITY_TYPES[account.liability_type];
  }

  let numberAttribute = null;
  if (account.account_type === ASSET) {
    if (account.asset_type === 'Cash') {
      if (['Checking', 'Savings'].includes(account.subtype)) {
        numberAttribute = 'balance';
      } else {
        numberAttribute = 'amount';
      }
    } else {
      numberAttribute = 'value';
    }
  } else if (account.account_type === LIABILITY) {
    numberAttribute = 'amount';
  }

  return (
    <BaseDialog
      type={defaultAccount._type}
      title={`${mode} ${defaultAccount._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          <TextFieldListItem
            id='name'
            label='name'
            value={account.name}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='institution'
            label='institution'
            value={account.institution}
            onChange={handleChange}
          />
          {numberAttribute && (
            <TextFieldListItem
              id={numberAttribute}
              label={numberAttribute}
              value={account[numberAttribute]}
              onChange={(e) => {
                const otherNumberAttributes = numberAttributes.filter(
                  (attr) => attr !== numberAttribute
                );
                setAccount((prevAccount) => ({
                  ...prevAccount,
                  [numberAttribute]: e.target.value,
                  ...otherNumberAttributes.map((attr) => ({ [attr]: '' })),
                }));
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}

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
                {ACCOUNT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          {/* SUB TYPE SELECT */}
          {account.account_type === ASSET && (
            <ListItem disableGutters>
              <FormControl variant='standard' fullWidth>
                <InputLabel id='asset_type-label'>asset type</InputLabel>
                <Select
                  labelId='asset_type-label'
                  id='asset_type'
                  value={account.asset_type}
                  onChange={(e) => {
                    setAccount((prevAccount) => ({
                      ...prevAccount,
                      asset_type: e.target.value,
                    }));
                  }}
                >
                  {Object.keys(ASSET_TYPES).map((type) => (
                    <MenuItem key={type} value={type}>
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
          )}
          {account.account_type === LIABILITY && (
            <ListItem disableGutters>
              <FormControl variant='standard' fullWidth>
                <InputLabel id='liability_type-label'>
                  liability type
                </InputLabel>
                <Select
                  labelId='liability_type-label'
                  id='liability_type'
                  value={account.liability_type}
                  onChange={(e) => {
                    setAccount((prevAccount) => ({
                      ...prevAccount,
                      liability_type: e.target.value,
                    }));
                  }}
                >
                  {Object.keys(LIABILITY_TYPES).map((type) => (
                    <MenuItem key={type} value={type}>
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
          )}
          {/* SUB TYPE ATTRIBUTES */}
          {subtypes && subtypes.length > 0 && (
            <ListItem disableGutters>
              <FormControl variant='standard' fullWidth>
                <InputLabel id='subtype-label'>subtype</InputLabel>
                <Select
                  labelId='subtype-label'
                  id='subtype'
                  value={account.subtype}
                  onChange={(e) => {
                    setAccount((prevAccount) => ({
                      ...prevAccount,
                      subtype: e.target.value,
                    }));
                  }}
                >
                  {subtypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
          )}
          {account.account_type === LIABILITY && (
            <TextFieldListItem
              id='interest_rate'
              label='interest rate'
              value={account.interest_rate || ''}
              onChange={handleChange}
            />
          )}
          <TextFieldListItem
            id='url'
            label='url'
            value={account.url}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='icon_url'
            label='icon url'
            value={account.icon_url}
            onChange={handleChange}
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
