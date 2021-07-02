import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons';
import DatePicker from '@material-ui/lab/DatePicker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box, Button, InputAdornment, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  form: {
    marginTop: '1rem',
  },
  input: {
    marginTop: '.5rem',
    marginBottom: '.5rem',
  },
  button: {
    marginTop: '.5rem',
    width: '100%',
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
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  // const handleSubmit = () => {};
  // const handleTypeSelect = () => {};
  // const validate = () => {};

  return (
    <Box sx={{ minWidth: 120 }}>
      <form className={classes.form}>
        <Autocomplete
          id='type-select'
          className={classes.input}
          freeSolo
          value={selectedType}
          options={user.expense.types}
          getOptionLabel={(option) => option}
          onChange={(e, val) => setSelectedType(val)}
          renderInput={(params) => (
            <TextField {...params} label='type' variant='outlined' />
          )}
        />
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
        {selectedType === 'stock' || selectedType === 'crypto' ? (
          <TextField
            sx={{ marginTop: '.5rem' }}
            fullWidth
            id='ticker-input'
            label='ticker'
            name='ticker'
            value={ticker}
            variant='outlined'
            onChange={(e) => setTicker(e.target.value)}
          />
        ) : null}
        {selectedType === 'stock' || selectedType === 'crypto' ? (
          <TextField
            fullWidth
            id='shares-input'
            sx={{ marginTop: '.5rem' }}
            label='shares'
            name='shares'
            value={shares}
            variant='outlined'
            onChange={(e) => setShares(e.target.value)}
          />
        ) : null}
        <Autocomplete
          id='vendor-select'
          className={classes.input}
          autoComplete
          freeSolo
          value={selectedVendor}
          options={user.expense.vendors}
          getOptionLabel={(option) => option}
          onChange={(e, val) => setSelectedVendor(val)}
          renderInput={(params) => (
            <TextField {...params} label='vendor' variant='outlined' />
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
        <div style={{ marginTop: '.5rem', marginBottom: '.5rem' }}>
          <DatePicker
            label='date'
            value={date}
            onChange={(val) => {
              setDate(val);
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </div>
        <Button variant='contained' className={classes.button}>
          Submit
        </Button>
      </form>
    </Box>
  );
}
