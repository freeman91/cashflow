import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
} from '@material-ui/icons';
import DatePicker from '@material-ui/lab/DatePicker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box, InputAdornment, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  form: {
    marginTop: '1rem',
  },
  input: {
    marginTop: '.5rem',
    marginBottom: '.5rem',
  },
});

export default function ExpenseForm() {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const [selectedType, setSelectedType] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  // const handleSubmit = () => {};
  // const handleTypeSelect = () => {};

  return (
    <Box sx={{ minWidth: 120 }}>
      <form className={classes.form}>
        <Autocomplete
          id='expense-type-select'
          className={classes.input}
          freeSolo
          value={selectedType}
          options={user.expense.types}
          getOptionLabel={(option) => option}
          onChange={(e, val) => setSelectedType(val)}
          renderInput={(params) => (
            <TextField {...params} label='expense type' variant='outlined' />
          )}
        />
        {!selectedType ? null : (
          <>
            <TextField
              fullWidth
              id='amount-input'
              className={classes.input}
              label='amount'
              name='amount'
              required
              value={amount}
              variant='outlined'
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Autocomplete
              id='expense-vendor-select'
              className={classes.input}
              autoComplete
              freeSolo
              value={selectedVendor}
              options={user.expense.vendors}
              getOptionLabel={(option) => option}
              onChange={(e, val) => setSelectedVendor(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='expense vendor'
                  variant='outlined'
                />
              )}
            />
            <TextField
              fullWidth
              id='description-input'
              className={classes.input}
              label='description'
              name='description'
              value={description}
              variant='outlined'
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div style={{ marginTop: '.5rem' }}>
              <DatePicker
                label='Date'
                value={date}
                onChange={(val) => {
                  setDate(val);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </div>
          </>
        )}
      </form>
    </Box>
  );
}
