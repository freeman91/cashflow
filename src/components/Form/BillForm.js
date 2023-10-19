import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';

import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  AccessAlarm as AccessAlarmIcon,
} from '@mui/icons-material';
import { Button, InputAdornment, List, ListItem, Stack } from '@mui/material';

import { deleteBill, postBill, putBill } from '../../store/bills';
import { TextFieldListItem } from '../List/TextFieldListItem';
import { AutocompleteListItem } from '../List/AutocompleteListItem';

const defaultState = {
  name: '',
  amount: '',
  type: '',
  vendor: '',
  rule: '',
  description: '',
};

export default function BillForm({ mode, bill, date, handleClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(defaultState);

  useEffect(() => {
    setValues({
      ...values,
      date: date,
    });
    // eslint-disable-next-line
  }, [date]);

  useEffect(() => {
    if (mode === 'update') {
      setValues({
        name: get(bill, 'name', 0),
        amount: get(bill, 'amount', 0),
        type: get(bill, 'type', ''),
        vendor: get(bill, 'vendor', ''),
        rule: get(bill, 'rule', ''),
        description: get(bill, 'description', ''),
      });
    }
  }, [mode, bill]);

  const handleCreate = (e) => {
    e.preventDefault();

    const newBill = {
      name: values.name,
      amount: Number(values.amount),
      type: values.type,
      vendor: values.vendor,
      rule: values.rule,
      description: values.description,
    };
    dispatch(postBill(newBill));
    handleClose();
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    let updatedBill = {
      id: get(bill, 'id'),
      name: get(values, 'name'),
      amount: Number(get(values, 'amount')),
      description: get(values, 'description'),
      type: get(values, 'type'),
      rule: get(values, 'rule'),
      vendor: get(values, 'vendor'),
    };
    dispatch(putBill(updatedBill));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteBill(get(bill, 'id')));
    handleClose();
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      handleCreate();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleClose();
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const billDiff = () => {
    if (
      values.name === get(bill, 'name') &&
      values.amount === get(bill, 'amount') &&
      values.type === get(bill, 'type') &&
      values.vendor === get(bill, 'vendor') &&
      values.rule === get(bill, 'rule') &&
      values.description === get(bill, 'description')
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <List>
        <TextFieldListItem
          id='name'
          label='name'
          value={values.name}
          onChange={handleChange}
        />
        <TextFieldListItem
          id='amount'
          label='amount'
          placeholder='0'
          value={values.amount}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        <AutocompleteListItem
          id='type'
          label='type'
          value={values.type}
          options={user.expense_types}
          onChange={(e, value) => {
            setValues({ ...values, type: value ? value : '' });
          }}
        />
        <AutocompleteListItem
          id='vendor'
          label='vendor'
          value={values.vendor}
          options={user.expense_vendors}
          onChange={(e, value) => {
            setValues({ ...values, vendor: value ? value : '' });
          }}
        />
        <TextFieldListItem
          id='rule'
          label='rule "day month"'
          value={values.rule}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <AccessAlarmIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextFieldListItem
          id='description'
          label='description'
          value={values.description}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <DescriptionIcon />
              </InputAdornment>
            ),
          }}
        />
        <ListItem>
          <Stack
            direction='row'
            spacing={2}
            sx={{ width: '100%' }}
            justifyContent='flex-end'
          >
            <Button
              id='cancel'
              variant='outlined'
              color='secondary'
              onClick={handleClose}
            >
              Cancel
            </Button>
            {mode === 'create' ? (
              <Button
                type='submit'
                id='submit'
                variant='contained'
                color='primary'
                onClick={handleCreate}
              >
                Create
              </Button>
            ) : (
              <>
                <Button
                  id='delete'
                  variant='contained'
                  onClick={handleDelete}
                  color='error'
                >
                  Delete
                </Button>
                <Button
                  type='submit'
                  id='update'
                  disabled={!billDiff()}
                  variant='contained'
                  onClick={handleUpdate}
                  color='primary'
                >
                  Update
                </Button>
              </>
            )}
          </Stack>
        </ListItem>
      </List>
    </form>
  );
}
