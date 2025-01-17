import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { postPurchase, putPurchase } from '../../store/purchases';
import { closeItemView } from '../../store/itemView';
import AssetSelect from '../Selector/AssetSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import TextFieldListItem from '../List/TextFieldListItem';
import SecuritySelect from '../Selector/SecuritySelect';

const defaultPurchase = {
  purchase_id: '',
  account_id: '',
  security_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  merchant: '',
  shares: '',
  price: '',
  _type: 'purchase',
};

function PurchaseDialog(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const purchases = useSelector((state) => state.purchases.data);
  const [purchase, setPurchase] = useState(defaultPurchase);

  useEffect(() => {
    if (attrs?.purchase_id) {
      let _purchase = find(purchases, { purchase_id: attrs.purchase_id });
      if (_purchase) {
        setPurchase({
          ..._purchase,
          date: dayjs(_purchase.date),
        });
      }
    } else {
      if (attrs.account_id) {
        const account = find(accounts, { account_id: attrs.account_id });
        setPurchase({
          ...defaultPurchase,
          ...attrs,
          merchant: account.institution,
          date: dayjs().hour(12).minute(0).second(0),
        });
      }
    }
    return () => {
      setPurchase(defaultPurchase);
    };
  }, [attrs, accounts, purchases]);

  const handleChange = (id, value) => {
    setPurchase({ ...purchase, [id]: value });
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postPurchase(purchase));
    } else dispatch(putPurchase(purchase));
    handleClose();
  };

  return (
    <>
      <ListItem disableGutters>
        <AssetSelect
          accountId={purchase.account_id}
          onChange={(value) => handleChange('account_id', value)}
        />
      </ListItem>
      <ListItem disableGutters>
        <SecuritySelect
          accountId={purchase.account_id}
          resource={purchase}
          setResource={setPurchase}
        />
      </ListItem>
      <ListItem disableGutters>
        <DatePicker
          label='date'
          value={purchase.date}
          onChange={(value) => handleChange('date', value)}
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
        value={purchase.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      <DecimalFieldListItem
        id='shares'
        value={purchase.shares}
        onChange={(value) => handleChange('shares', value)}
        startAdornment={null}
      />
      <DecimalFieldListItem
        id='price'
        value={purchase.price}
        onChange={(value) => handleChange('price', value)}
        startAdornment={null}
      />
      <TextFieldListItem
        id='merchant'
        label='merchant'
        value={purchase.merchant}
        inputProps={{
          readOnly: true,
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
    </>
  );
}

export default PurchaseDialog;
