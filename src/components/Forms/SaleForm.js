import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { postSale, putSale } from '../../store/sales';
import { closeItemView } from '../../store/itemView';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import SharesFieldListItem from '../List/SharesFieldListItem';
import DepositToSelect from '../Selector/DepositToSelect';
import SecuritySelect from '../Selector/SecuritySelect';
import TextFieldListItem from '../List/TextFieldListItem';

const defaultSale = {
  sale_id: '',
  _type: 'sale',
  account_id: '',
  security_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  merchant: '',
  shares: '',
  price: '',
  deposit_to_id: '',
  fee: '',
};

function SaleForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const sales = useSelector((state) => state.sales.data);

  const [sale, setSale] = useState(defaultSale);

  useEffect(() => {
    if (attrs?.sale_id) {
      let _sale = find(sales, { sale_id: attrs.sale_id });
      if (_sale) {
        setSale({
          ..._sale,
          date: dayjs(_sale.date),
        });
      }
    } else {
      if (attrs.account_id) {
        const account = find(accounts, { account_id: attrs.account_id });
        setSale((e) => ({
          ...defaultSale,
          ...attrs,
          merchant: account.institution,
          date: dayjs().hour(12).minute(0).second(0),
        }));
      }
    }
    return () => {
      setSale(defaultSale);
    };
  }, [attrs, accounts, sales]);

  const handleChange = (id, value) => {
    setSale((prevSale) => ({ ...prevSale, [id]: value }));
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postSale(sale));
    } else dispatch(putSale(sale));
    handleClose();
  };

  return (
    <>
      <ListItem disableGutters>
        <SecuritySelect
          accountId={sale.account_id}
          resource={sale}
          setResource={setSale}
        />
      </ListItem>
      <ListItem disableGutters>
        <DatePicker
          label='date'
          value={sale.date}
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
        value={sale.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      <DecimalFieldListItem
        id='fee'
        value={sale.fee}
        onChange={(value) => handleChange('fee', value)}
      />
      <DecimalFieldListItem
        id='price'
        value={sale.price}
        onChange={(value) => handleChange('price', value)}
      />
      <SharesFieldListItem
        id='shares'
        value={sale.shares}
        onChange={(value) => handleChange('shares', value)}
        securityId={sale.security_id}
        mode={mode}
      />
      <TextFieldListItem
        id='merchant'
        label='merchant'
        value={sale.merchant}
        inputProps={{
          readOnly: true,
        }}
      />
      <ListItem disableGutters>
        <DepositToSelect
          accountId={sale.deposit_to_id}
          onChange={(value) =>
            handleChange({ target: { id: 'deposit_to_id', value } })
          }
        />
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
    </>
  );
}

export default SaleForm;
