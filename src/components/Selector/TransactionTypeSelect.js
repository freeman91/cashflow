import React from 'react';
import startCase from 'lodash/startCase';

import useTheme from '@mui/material/styles/useTheme';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const TRANSACTION_TYPES = [
  'purchase',
  'sale',
  'transfer',
  'borrow',
  'repayment',
  'expense',
  'income',
  'paycheck',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight: TRANSACTION_TYPES.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function TransactionTypeSelect(props) {
  const { types, setTypes } = props;
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTypes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id='types-select-label-id'>Types</InputLabel>
      <Select
        labelId='types-select-label-id'
        id='demo-multiple-name'
        multiple
        value={types}
        onChange={handleChange}
        MenuProps={MenuProps}
        variant='standard'
        sx={{ width: 300 }}
        disableUnderline
      >
        {TRANSACTION_TYPES.map((type) => (
          <MenuItem
            key={type}
            value={type}
            style={getStyles(type, types, theme)}
          >
            {startCase(type)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
