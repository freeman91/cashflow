import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { postAccount, putAccount } from '../../store/accounts';
import { closeItemView } from '../../store/itemView';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import TextFieldListItem from '../List/TextFieldListItem';

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

function AccountForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.data);

  const [account, setAccount] = useState(defaultAccount);

  useEffect(() => {
    if (attrs.account_id) {
      let _account = find(accounts, { account_id: attrs.account_id });
      setAccount(_account);
    } else {
      setAccount({ ...defaultAccount, ...attrs });
    }
    return () => {
      setAccount(defaultAccount);
    };
  }, [attrs, accounts]);

  const handleChange = (id, value) => {
    setAccount((prevAccount) => ({
      ...prevAccount,
      [id]: value,
    }));
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postAccount(account));
    } else dispatch(putAccount(account));
    handleClose();
  };

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
    <>
      <TextFieldListItem
        id='name'
        label='name'
        value={account.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <TextFieldListItem
        id='institution'
        label='institution'
        value={account.institution}
        onChange={(e) => handleChange('institution', e.target.value)}
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
              ...otherNumberAttributes.reduce((acc, attr) => {
                acc[attr] = '';
                return acc;
              }, {}),
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
            <InputLabel id='liability_type-label'>liability type</InputLabel>
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
        <DecimalFieldListItem
          id='interest_rate'
          value={account.interest_rate || ''}
          onChange={(value) => handleChange('interest_rate', value)}
        />
      )}
      <TextFieldListItem
        id='url'
        label='url'
        value={account.url}
        onChange={(e) => handleChange('url', e.target.value)}
      />
      <TextFieldListItem
        id='icon_url'
        label='icon url'
        value={account.icon_url}
        onChange={(e) => handleChange('icon_url', e.target.value)}
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
    </>
  );
}

export default AccountForm;
