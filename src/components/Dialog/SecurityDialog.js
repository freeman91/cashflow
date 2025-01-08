import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import {
  deleteSecurity,
  postSecurity,
  putSecurity,
} from '../../store/securities';
import { closeDialog } from '../../store/dialogs';
import { _numberToCurrency } from '../../helpers/currency';

import BaseDialog from './BaseDialog';
import AccountSelect from '../Selector/AccountSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import SelectOption from '../Selector/SelectOption';

export const defaultSecurity = {
  security_id: '',
  account_id: '',
  _type: 'security',
  name: '',
  ticker: '',
  security_type: '',
  shares: 0,
  price: 0,
  icon_url: '',
};

export const SECURITY_TYPES = [
  'Stock',
  'Mutual Fund',
  'Index Fund',
  'ETF',
  'Crypto',
  'Bond',
  'Cash',
];

function SecurityDialog() {
  const dispatch = useDispatch();
  const securities = useSelector((state) => state.securities.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.security);
  const [security, setSecurity] = useState(defaultSecurity);

  useEffect(() => {
    if (id) {
      let _security = find(securities, { security_id: id });
      setSecurity(_security);
    }
  }, [id, securities]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setSecurity((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setSecurity({ ...security, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let _security = { ...security };

    if (mode === 'create') {
      dispatch(postSecurity(_security));
    } else dispatch(putSecurity(_security));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteSecurity(security.security_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('security'));
    setSecurity(defaultSecurity);
  };

  const handleCreateSale = () => {
    dispatch(closeDialog('security'));
    // dispatch(
    //   openDialog({
    //     type: 'sale',
    //     mode: 'create',
    //     attrs: { security_id: security.security_id },
    //   })
    // );
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='purchase' onClick={() => {}}>
        purchase
      </MenuItem>
    ),
    mode === 'edit' && (
      <MenuItem key='sale' onClick={handleCreateSale}>
        sale
      </MenuItem>
    ),
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  const value = security.price * security.shares;
  return (
    <BaseDialog
      type={defaultSecurity._type}
      title={`${mode} ${defaultSecurity._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='security_id'
              label='security_id'
              value={security.security_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <AccountSelect resource={security} setResource={setSecurity} />
          <TextFieldListItem
            id='name'
            label='name'
            value={security.name}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='ticker'
            label='ticker'
            value={security.ticker}
            onChange={handleChange}
          />

          <SelectOption
            id='security_type'
            label='security type'
            value={security.security_type}
            options={SECURITY_TYPES}
            onChange={handleChange}
          />
          <TextFieldListItem
            disabled
            id='value'
            label='value'
            placeholder='0.00'
            value={_numberToCurrency.format(value)}
            inputProps={{ inputMode: 'decimal' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <DecimalFieldListItem
            id='shares'
            item={security}
            setItem={setSecurity}
            startAdornment={null}
          />
          <DecimalFieldListItem
            id='price'
            item={security}
            setItem={setSecurity}
          />
          <TextFieldListItem
            id='icon_url'
            label='icon url'
            value={security.icon_url}
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

export default SecurityDialog;
