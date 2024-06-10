import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  deletePurchase,
  postPurchase,
  putPurchase,
} from '../../store/purchases';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import AssetSelect from '../Selector/AssetSelect';

const defaultPurchase = {
  purchase_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  vendor: '',
  shares: '',
  price: '',
  _type: 'purchase',
  asset_id: '',
};

function PurchaseDialog() {
  const dispatch = useDispatch();
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const assets = useSelector((state) => state.assets.data);
  const purchases = useSelector((state) => state.purchases.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.purchase);

  const [purchase, setPurchase] = useState(defaultPurchase);

  useEffect(() => {
    let _vendor = '';
    if (purchase.asset_id) {
      const asset = find(assets, { asset_id: purchase.asset_id });
      const account = find(accounts, { account_id: asset?.account_id });
      _vendor = get(account, 'name', '');
    }
    setPurchase((e) => ({ ...e, vendor: _vendor }));
  }, [purchase.asset_id, accounts, assets]);

  useEffect(() => {
    if (mode !== 'create') {
      let _pathname = location.pathname;
      let _id = _pathname.replace('/app/assets', '');
      _id = _id.replace('/', '');
      setPurchase((e) => ({ ...e, asset_id: _id }));
    }
  }, [location.pathname, mode]);

  useEffect(() => {
    if (id) {
      let _purchase = find(purchases, { purchase_id: id });
      setPurchase({
        ..._purchase,
        date: dayjs(_purchase.date),
      });
    }
  }, [id, purchases]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setPurchase((e) => ({ ...e, ...attrs, date: dayjs(attrs.date) }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setPurchase({ ...purchase, [e.target.id]: e.target.value });
  };
  const handleChangeNumber = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setPurchase({ ...purchase, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postPurchase(purchase));
    } else dispatch(putPurchase(purchase));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deletePurchase(purchase.purchase_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('purchase'));
    setPurchase(defaultPurchase);
  };

  return (
    <BaseDialog
      type={defaultPurchase._type}
      title={`${mode} ${defaultPurchase._type}`}
      handleClose={handleClose}
      titleOptions={<MenuItem onClick={handleDelete}>delete</MenuItem>}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='purchase_id'
              label='purchase_id'
              value={purchase.purchase_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <AssetSelect resource={purchase} setResource={setPurchase} />
          <ListItem sx={{ pl: 0, pr: 0 }}>
            <DatePicker
              label='date'
              value={purchase.date}
              onChange={(value) => {
                setPurchase({
                  ...purchase,
                  date: value.hour(12).minute(0).second(0),
                });
              }}
              slotProps={{
                textField: {
                  variant: 'standard',
                  fullWidth: true,
                },
              }}
            />
          </ListItem>
          <TextFieldListItem
            id='amount'
            label='amount'
            placeholder='0.00'
            value={purchase.amount}
            onChange={handleChangeNumber}
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
            id='shares'
            label='shares'
            placeholder='0.00'
            value={purchase.shares}
            onChange={handleChangeNumber}
            inputProps={{ inputMode: 'decimal' }}
          />
          <TextFieldListItem
            id='price'
            label='price'
            placeholder='0.00'
            value={purchase.price}
            onChange={handleChangeNumber}
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
            id='vendor'
            label='vendor'
            value={purchase.vendor}
            onChange={handleChange}
          />
          <ListItem
            key='buttons'
            disablePadding
            sx={{ pt: 1, pl: 0, pr: 0, justifyContent: 'space-between' }}
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

export default PurchaseDialog;
