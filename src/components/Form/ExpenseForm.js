import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import dayjs from 'dayjs';

import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Button,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';

import { deleteExpense, postExpense, putExpense } from '../../store/expenses';
import { TextFieldListItem } from '../List/TextFieldListItem';
import { AutocompleteListItem } from '../List/AutocompleteListItem';

const default_state = {
  amount: '',
  type: '',
  vendor: '',
  description: '',
  date: dayjs(),
  paid: true,
};

export default function ExpenseForm({ mode, expense, date, handleClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);

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
        amount: get(expense, 'amount', 0),
        type: get(expense, 'type', ''),
        vendor: get(expense, 'vendor', ''),
        description: get(expense, 'description', ''),
        date: dayjs(get(expense, 'date')),
      });
    }
  }, [mode, expense]);

  const handleCreate = (e) => {
    e.preventDefault();
    const new_expense = {
      amount: Number(values.amount),
      type: values.type,
      vendor: values.vendor,
      description: values.description,
      date: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(postExpense(new_expense));
    handleClose();
  };

  const handleUpdate = () => {
    let updatedExpense = {
      id: get(expense, 'id'),
      amount: Number(get(values, 'amount')),
      asset: get(values, 'asset'),
      debt: get(values, 'debt'),
      description: get(values, 'description'),
      type: get(values, 'type'),
      vendor: get(values, 'vendor'),
      date: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(putExpense(updatedExpense));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteExpense(get(expense, 'id')));
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

  const expenseDiff = () => {
    if (
      values.amount === get(expense, 'amount') &&
      values.type === get(expense, 'type') &&
      values.vendor === get(expense, 'vendor') &&
      values.description === get(expense, 'description') &&
      values.paid === get(expense, 'paid') &&
      dayjs(values.date).format('MM-DD-YYYY') === get(expense, 'date')
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
          <DatePicker
            label='date'
            value={values.date}
            onChange={(value) => {
              setValues({ ...values, date: value });
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant='standard' />
            )}
          />
        </ListItem>
        {get(expense, 'paid', true) ? null : (
          <ListItem key={values.paid} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() => setValues({ ...values, paid: !values.paid })}
              dense
            >
              <ListItemIcon>
                <Checkbox edge='start' checked={values.paid} tabIndex={-1} />
              </ListItemIcon>
              <ListItemText primary={values.paid ? 'Paid' : 'Unpaid'} />
            </ListItemButton>
          </ListItem>
        )}
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
                  disabled={!expenseDiff()}
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
