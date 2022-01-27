import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import dayjs from 'dayjs';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import DatePicker from '@mui/lab/DatePicker';
import Autocomplete from '@mui/lab/Autocomplete';
import { Box, Button, InputAdornment, TextField } from '@mui/material';

import { deleteExpense, postExpense, putExpense } from '../../store/expenses';

const default_state = {
  amount: '',
  type: '',
  vendor: '',
  description: '',
  date: new Date(),
};

export default function ExpenseForm({ handleDialogClose, mode, expense }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);

  useEffect(() => {
    if (mode === 'update') {
      setValues({
        amount: get(expense, 'amount', 0),
        type: get(expense, 'type', ''),
        vendor: get(expense, 'vendor', ''),
        description: get(expense, 'description', ''),
        date: new Date(get(expense, 'date')),
      });
    }
  }, [mode, expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const new_expense = {
      amount: Number(values.amount),
      type: values.type,
      vendor: values.vendor,
      description: values.description,
      date: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(postExpense(new_expense));
    handleDialogClose();
  };

  const handleUpdate = () => {
    let updatedExpense = {
      ...expense,
      ...values,
      date: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(putExpense(updatedExpense));
    handleDialogClose();
  };

  const handleDelete = () => {
    dispatch(deleteExpense(get(expense, '_id')));
    handleDialogClose();
  };

  const handleFormEnterClick = () => {
    if (mode === 'create') {
      handleSubmit();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleDialogClose();
    }
  };

  const expenseDiff = () => {
    if (
      values.amount === get(expense, 'amount') &&
      values.type === get(expense, 'type') &&
      values.vendor === get(expense, 'vendor') &&
      values.description === get(expense, 'description') &&
      dayjs(values.date).format('MM-DD-YYYY') === get(expense, 'date')
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Box>
      <form onSubmit={handleFormEnterClick}>
        <TextField
          fullWidth
          id='amount-input'
          label='amount'
          name='amount'
          required
          value={values.amount}
          variant='outlined'
          placeholder='0'
          onChange={(e) => {
            setValues({ ...values, amount: String(e.target.value) });
          }}
          margin='dense'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        <Autocomplete
          data-lpignore='true'
          id='type-select'
          autoComplete
          freeSolo
          value={values.type}
          options={user.expense.types}
          getOptionLabel={(option) => option}
          onChange={(e, value) =>
            setValues({ ...values, type: value ? value : '' })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label='type'
              variant='outlined'
              margin='dense'
            />
          )}
        />
        <Autocomplete
          id='vendor-select'
          autoComplete
          freeSolo
          value={values.vendor}
          options={user.expense.vendors}
          getOptionLabel={(option) => option}
          onChange={(e, value) =>
            setValues({ ...values, vendor: value ? value : '' })
          }
          autoSelect
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label='vendor'
              variant='outlined'
              margin='dense'
            />
          )}
        />
        <TextField
          fullWidth
          id='description-input'
          label='description'
          name='description'
          value={values.description}
          variant='outlined'
          margin='dense'
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <DescriptionIcon />
              </InputAdornment>
            ),
          }}
        />
        <DatePicker
          label='date'
          value={values.date}
          onChange={(value) => {
            setValues({ ...values, date: value });
          }}
          renderInput={(params) => (
            <TextField fullWidth {...params} margin='dense' required />
          )}
        />
        <Button
          id='cancel'
          sx={{ mr: '1rem', mt: '1rem', width: '5rem' }}
          variant='outlined'
          color='info'
          onClick={handleDialogClose}
        >
          Cancel
        </Button>
        {mode === 'create' ? (
          <Button
            type='submit'
            id='submit'
            sx={{ mt: '1rem' }}
            variant='outlined'
            onClick={handleSubmit}
            color='success'
          >
            Submit
          </Button>
        ) : (
          <>
            <Button
              type='submit'
              id='update'
              disabled={!expenseDiff()}
              sx={{ mt: '1rem' }}
              variant='outlined'
              onClick={handleUpdate}
              color='success'
            >
              Update
            </Button>
            <Button
              id='delete'
              sx={{ mt: '1rem', ml: '1rem' }}
              variant='outlined'
              onClick={handleDelete}
              color='error'
            >
              Delete
            </Button>
          </>
        )}
      </form>
    </Box>
  );
}
