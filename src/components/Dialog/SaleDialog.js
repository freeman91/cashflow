import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { deleteSale, postSale, putSale } from '../../store/sales';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import AssetSelect from '../Selector/AssetSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import SharesFieldListItem from '../List/SharesFieldListItem';
import DepositToSelect from '../Selector/DepositToSelect';

const defaultSale = {
  sale_id: '',
  _type: 'sale',
  account_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  merchant: '',
  shares: '',
  price: '',
  deposit_to_id: '',
  fee: '',
};

function SaleDialog() {
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const sales = useSelector((state) => state.sales.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.sale);

  const [sale, setSale] = useState(defaultSale);
  const [account, setAccount] = useState({});

  useEffect(() => {
    if (mode === 'create') {
      const account = find(accounts, { account_id: sale.account_id });
      setAccount(account);
      setSale((e) => ({
        ...e,
        merchant: account.institution,
        price: account.price,
      }));
    }
  }, [sale.account_id, accounts, mode]);

  useEffect(() => {
    if (id) {
      let _sale = find(sales, { sale_id: id });
      if (_sale) {
        setSale({
          ..._sale,
          date: dayjs(_sale.date),
        });
      }
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

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultSale._type}
      title={`${mode} ${defaultSale._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='sale_id'
              label='sale_id'
              value={sale.sale_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <AssetSelect resource={sale} setResource={setSale} />
          <ListItem disableGutters>
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
          <DecimalFieldListItem id='amount' item={sale} setItem={setSale} />
          <DecimalFieldListItem id='fee' item={sale} setItem={setSale} />
          <DecimalFieldListItem id='price' item={sale} setItem={setSale} />
          <SharesFieldListItem
            id='shares'
            item={sale}
            setItem={setSale}
            shares={account?.shares}
            mode={mode}
          />

          <TextFieldListItem
            id='merchant'
            label='merchant'
            value={sale.merchant}
            onChange={handleChange}
          />
          <ListItem disableGutters>
            <DepositToSelect resource={sale} setResource={setSale} />
          </ListItem>
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

export default SaleDialog;
