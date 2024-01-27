import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';

export default function AmountFilter(props) {
  const { amountFilter, setAmountFilter } = props;

  const handleClick = (event) => {
    if (event.target.innerText === amountFilter.comparator) {
      setAmountFilter({
        comparator: '',
        amount: amountFilter.amount,
      });
    } else {
      setAmountFilter({
        comparator: event.target.innerText,
        amount: amountFilter.amount,
      });
    }
  };

  const handleChange = (event) =>
    setAmountFilter({
      comparator: amountFilter.comparator,
      amount: event.target.value,
    });

  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <TextField
        label='amount'
        value={amountFilter.amount}
        onChange={handleChange}
        variant='standard'
      />
      <Chip
        label={'<'}
        onClick={handleClick}
        variant={amountFilter.comparator === '<' ? 'filled' : 'outlined'}
      />
      <Chip
        label={'='}
        onClick={handleClick}
        variant={amountFilter.comparator === '=' ? 'filled' : 'outlined'}
      />
      <Chip
        label={'>'}
        onClick={handleClick}
        variant={amountFilter.comparator === '>' ? 'filled' : 'outlined'}
      />
    </Stack>
  );
}
