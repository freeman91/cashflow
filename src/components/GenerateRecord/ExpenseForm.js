import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons';
import DatePicker from '@material-ui/lab/DatePicker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box, FormControl, InputAdornment, TextField } from '@material-ui/core';

export default function ExpenseForm() {
  const user = useSelector((state) => state.user);
  const [selectedType, setSelectedType] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  // const handleSubmit = () => {};
  // const handleTypeSelect = () => {};

  console.log('date: ', date);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Autocomplete
          id='expense-type-select'
          autoComplete
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
              id='amount-input'
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
              id='description-input'
              label='description'
              name='description'
              required
              value={description}
              variant='outlined'
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
            />
            <DatePicker
              label='Basic example'
              value={date}
              onChange={(val) => {
                setDate(val);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </>
        )}
      </FormControl>
    </Box>
  );
}
