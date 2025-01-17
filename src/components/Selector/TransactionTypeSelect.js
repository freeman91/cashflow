import React from 'react';
import startCase from 'lodash/startCase';

import FilterIcon from '@mui/icons-material/FilterList';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export const TRANSACTION_TYPES = [
  'purchase',
  'sale',
  'transfer',
  'borrow',
  'repayment',
  'expense',
  'income',
  'paycheck',
  'recurring',
];

export default function TransactionTypeSelect(props) {
  const { types, setTypes } = props;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTypes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Select
      labelId='types-select-label-id'
      id='demo-multiple-name'
      multiple
      value={types}
      onChange={handleChange}
      variant='standard'
      disableUnderline
      displayEmpty
      renderValue={(selected) => {
        if (selected.length === 0) return 'Show All Types';
        return selected.join(', ');
      }}
      IconComponent={() => <FilterIcon />}
      MenuProps={{
        MenuListProps: {
          disablePadding: true,
          sx: {
            bgcolor: 'surface.300',
            '& .MuiPaper-root': {
              minWidth: 'unset',
              borderRadius: 1,
              overflow: 'hidden',
            },
          },
        },
        slotProps: {
          paper: {
            sx: {
              minWidth: 'unset !important',
            },
          },
        },
      }}
      sx={{
        backgroundColor: 'unset',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
    >
      {TRANSACTION_TYPES.map((type) => (
        <MenuItem key={type} value={type}>
          {startCase(type)}
        </MenuItem>
      ))}
    </Select>
  );
}
