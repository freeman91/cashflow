import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import find from 'lodash/find';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { postSecurity, putSecurity } from '../../store/securities';
import { closeItemView } from '../../store/itemView';
import { _numberToCurrency } from '../../helpers/currency';
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

function SecurityForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();
  const securities = useSelector((state) => state.securities.data);
  const [security, setSecurity] = useState(defaultSecurity);

  useEffect(() => {
    if (attrs?.security_id) {
      let _security = find(securities, { security_id: attrs.security_id });
      setSecurity(_security);
    } else {
      setSecurity((e) => ({ ...e, ...attrs }));
    }
    return () => {
      setSecurity(defaultSecurity);
    };
  }, [attrs, securities]);

  const handleChange = (id, value) => {
    setSecurity((prevSecurity) => ({
      ...prevSecurity,
      [id]: value,
    }));
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let _security = { ...security };
    if (mode === 'create') {
      dispatch(postSecurity(_security));
    } else dispatch(putSecurity(_security));
    handleClose();
  };

  const value = security.price * security.shares;
  return (
    <>
      <AccountSelect resource={security} setResource={setSecurity} />
      <TextFieldListItem
        id='name'
        label='name'
        value={security.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <TextFieldListItem
        id='ticker'
        label='ticker'
        value={security.ticker}
        onChange={(e) => handleChange('ticker', e.target.value)}
      />

      <SelectOption
        id='security_type'
        label='security type'
        value={security.security_type}
        options={SECURITY_TYPES}
        onChange={(value) => handleChange('security_type', value)}
      />
      <TextFieldListItem
        disabled
        id='value'
        label='value'
        placeholder='0.00'
        value={_numberToCurrency.format(value)}
        inputProps={{ inputMode: 'decimal' }}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <AttachMoneyIcon />
            </InputAdornment>
          ),
        }}
      />
      <DecimalFieldListItem
        id='shares'
        value={security.shares}
        onChange={(value) => handleChange('shares', value)}
        startAdornment={null}
      />
      <DecimalFieldListItem
        id='price'
        value={security.price}
        onChange={(value) => handleChange('price', value)}
      />
      <TextFieldListItem
        id='icon_url'
        label='icon url'
        value={security.icon_url}
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

export default SecurityForm;
