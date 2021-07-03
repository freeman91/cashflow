import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/styles';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons';
import DatePicker from '@material-ui/lab/DatePicker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box, Button, InputAdornment, TextField } from '@material-ui/core';

import { postExpense } from '../../store/expenses';

const useStyles = makeStyles({
  button: {},
});

const default_state = {
  amount: '',
  type: '',
  vendor: '',
  description: '',
  date: new Date(),
};

export default function ExpenseForm({ handleDialogClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);

  const handleSubmit = () => {
    try {
      const new_expense = {
        amount: Number(values.amount),
        type: values.type,
        vendor: values.vendor,
        description: values.description,
        date: dayjs(values.date).format('MM-DD-YYYY'),
      };
      dispatch(postExpense(new_expense));
    } catch (error) {
      console.error(error);
    } finally {
      handleDialogClose();
    }
  };

  const validate = () => {
    if (
      isNaN(values.amount) ||
      values.type.length === 0 ||
      !values.vendor ||
      values.vendor.length === 0 ||
      !values.date
    )
      return false;
    else return true;
  };

  return (
    <Box>
      <form id='search'>
        <TextField
          fullWidth
          id='amount-input'
          label='amount'
          name='amount'
          required
          value={values.amount}
          variant='outlined'
          placeholder='0'
          onChange={(e) => setValues({ ...values, amount: e.target.value })}
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
          className={classes.input}
          autoComplete
          freeSolo
          value={values.type}
          options={user.expense.types}
          getOptionLabel={(option) => option}
          onChange={(e, value) => setValues({ ...values, type: value })}
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
          className={classes.input}
          autoComplete
          freeSolo
          value={values.vendor}
          options={user.expense.vendors}
          getOptionLabel={(option) => option}
          onChange={(e, value) => setValues({ ...values, vendor: value })}
          autoSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label='vendor'
              variant='outlined'
              margin='dense'
            />
          )}
        />
        <TextField
          fullWidth
          id='description-input'
          className={classes.input}
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
          id='submit'
          disabled={!validate()}
          sx={{ marginTop: '1rem', width: '100%' }}
          variant='contained'
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
