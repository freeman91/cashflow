import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
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
import DecimalFieldListItem from '../List/DecimalFieldListItem';

const defaultPurchase = {
  purchase_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  merchant: '',
  shares: '',
  price: '',
  _type: 'purchase',
  account_id: '',
};

function PurchaseDialog() {
  const dispatch = useDispatch();

  const purchases = useSelector((state) => state.purchases.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.purchase);

  const [purchase, setPurchase] = useState(defaultPurchase);

  useEffect(() => {
    if (id) {
      let _purchase = find(purchases, { purchase_id: id });
      if (_purchase) {
        setPurchase({
          ..._purchase,
          date: dayjs(_purchase.date),
        });
      }
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

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultPurchase._type}
      title={`${mode} ${defaultPurchase._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
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
          <ListItem disableGutters>
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
          <DecimalFieldListItem
            id='amount'
            item={purchase}
            setItem={setPurchase}
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
            id='merchant'
            label='merchant'
            value={purchase.merchant}
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

export default PurchaseDialog;
