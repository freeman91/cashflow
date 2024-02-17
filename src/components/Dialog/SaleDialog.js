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

import { deleteSale, postSale, putSale } from '../../store/sales';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import AssetSelect from '../Selector/AssetSelect';

const defaultSale = {
  sale_id: '',
  _type: 'sale',
  asset_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  purchaser: '',
  shares: '',
  price: '',
};

function SaleDialog() {
  const dispatch = useDispatch();
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const assets = useSelector((state) => state.assets.data);
  const sales = useSelector((state) => state.sales.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.sale);

  const [sale, setSale] = useState(defaultSale);

  useEffect(() => {
    let _vendor = '';
    if (sale.asset_id) {
      const asset = find(assets, { asset_id: sale.asset_id });
      const account = find(accounts, { account_id: asset?.account_id });
      _vendor = get(account, 'name', '');
    }
    setSale((e) => ({ ...e, vendor: _vendor }));
  }, [sale.asset_id, accounts, assets]);

  useEffect(() => {
    if (mode !== 'create') {
      let _pathname = location.pathname;
      let _id = _pathname.replace('/app/assets', '');
      _id = _id.replace('/', '');
      setSale((e) => ({ ...e, asset_id: _id }));
    }
  }, [location.pathname, mode]);

  useEffect(() => {
    if (id) {
      let _sale = find(sales, { sale_id: id });
      setSale({
        ..._sale,
        date: dayjs(_sale.date),
      });
    }
  }, [id, sales]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setSale((e) => ({ ...e, ...attrs, date: dayjs(attrs.date) }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setSale({ ...sale, [e.target.id]: e.target.value });
  };
  const handleChangeNumber = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setSale({ ...sale, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postSale(sale));
    } else dispatch(putSale(sale));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteSale(sale.sale_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('sale'));
    setSale(defaultSale);
  };

  return (
    <BaseDialog
      type={defaultSale._type}
      title={`${mode} ${defaultSale._type}`}
      handleClose={handleClose}
      titleOptions={<MenuItem onClick={handleDelete}>delete</MenuItem>}
    >
      <form>
        <List sx={{ width: 375 }}>
          {mode !== 'create' && (
            <TextFieldListItem
              id='sale_id'
              label='sale_id'
              value={sale.sale_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )}
          <AssetSelect resource={sale} setResource={setSale} />
          <ListItem sx={{ pl: 0, pr: 0 }}>
            <DatePicker
              label='date'
              value={sale.date}
              onChange={(value) => {
                setSale({
                  ...sale,
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
            value={sale.amount}
            onChange={handleChangeNumber}
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
            value={sale.shares}
            onChange={handleChangeNumber}
          />
          <TextFieldListItem
            id='price'
            label='price'
            placeholder='0.00'
            value={sale.price}
            onChange={handleChangeNumber}
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
            value={sale.vendor}
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

export default SaleDialog;
