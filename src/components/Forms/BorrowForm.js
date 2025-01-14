import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';

import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { postBorrow, putBorrow } from '../../store/borrows';
import { closeItemView } from '../../store/itemView';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import LiabilitySelect from '../Selector/LiabilitySelect';

const defaultBorrow = {
  borrow_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  merchant: '',
  _type: 'borrow',
  account_id: '',
};

function BorrowForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const borrows = useSelector((state) => state.borrows.data);

  const [borrow, setBorrow] = useState(defaultBorrow);

  useEffect(() => {
    let _merchant = '';
    if (borrow.account_id) {
      const account = find(accounts, { account_id: borrow.account_id });
      _merchant = get(account, 'name', '');
    }
    setBorrow((prevBorrow) => ({ ...prevBorrow, merchant: _merchant }));
  }, [borrow.account_id, accounts]);

  useEffect(() => {
    if (attrs.borrow_id) {
      let _borrow = find(borrows, { borrow_id: attrs.borrow_id });
      setBorrow({
        ..._borrow,
        date: dayjs(_borrow.date),
      });
    } else {
      setBorrow((prevBorrow) => ({ ...prevBorrow, ...attrs }));
    }
    return () => {
      setBorrow(defaultBorrow);
    };
  }, [attrs, borrows]);

  const handleChange = (id, value) => {
    setBorrow((prevBorrow) => ({ ...prevBorrow, [id]: value }));
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postBorrow(borrow));
    } else dispatch(putBorrow(borrow));
    handleClose();
  };

  return (
    <>
      <ListItem disableGutters>
        <LiabilitySelect
          mode={mode}
          accountId={borrow?.account_id}
          setAccountId={(value) => handleChange('account_id', value)}
        />
      </ListItem>
      <ListItem disableGutters>
        <DatePicker
          label='date'
          value={borrow.date}
          onChange={(value) =>
            handleChange('date', value.hour(12).minute(0).second(0))
          }
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
        value={borrow.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      <TextFieldListItem
        id='merchant'
        label='merchant'
        value={borrow.merchant}
        onChange={(e) => handleChange('merchant', e.target.value)}
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

export default BorrowForm;
