import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { deleteBorrow, postBorrow, putBorrow } from '../../store/borrows';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import DebtSelect from '../Selector/DebtSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';

const defaultBorrow = {
  borrow_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  merchant: '',
  _type: 'borrow',
  account_id: '',
};

function BorrowDialog() {
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const borrows = useSelector((state) => state.borrows.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.borrow);

  const [borrow, setBorrow] = useState(defaultBorrow);

  useEffect(() => {
    let _merchant = '';
    if (borrow.account_id) {
      const account = find(accounts, { account_id: borrow.account_id });
      _merchant = get(account, 'name', '');
    }
    setBorrow((e) => ({ ...e, merchant: _merchant }));
  }, [borrow.account_id, accounts]);

  useEffect(() => {
    if (id) {
      let _borrow = find(borrows, { borrow_id: id });
      setBorrow({
        ..._borrow,
        date: dayjs(_borrow.date),
      });
    }
  }, [id, borrows]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setBorrow((e) => ({ ...e, ...attrs, date: dayjs(attrs.date) }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setBorrow({ ...borrow, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postBorrow(borrow));
    } else dispatch(putBorrow(borrow));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteBorrow(borrow.borrow_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('borrow'));
    setBorrow(defaultBorrow);
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
      type={defaultBorrow._type}
      title={`${mode} ${defaultBorrow._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='borrow_id'
              label='borrow_id'
              value={borrow.borrow_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <DebtSelect resource={borrow} setResource={setBorrow} />
          <ListItem disableGutters>
            <DatePicker
              label='date'
              value={borrow.date}
              onChange={(value) => {
                setBorrow({
                  ...borrow,
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
          <DecimalFieldListItem id='amount' item={borrow} setItem={setBorrow} />
          <TextFieldListItem
            id='merchant'
            label='merchant'
            value={borrow.merchant}
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

export default BorrowDialog;
