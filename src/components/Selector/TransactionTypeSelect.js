import React from 'react';
import startCase from 'lodash/startCase';

import FilterIcon from '@mui/icons-material/FilterList';
import useTheme from '@mui/material/styles/useTheme';
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
    <Select
      labelId='types-select-label-id'
      id='demo-multiple-name'
      multiple
      value={types}
      onChange={handleChange}
      variant='standard'
      sx={{ px: 2, width: 300, ml: 1 }}
      disableUnderline
      displayEmpty
      renderValue={(selected) => {
        if (selected.length === 0) return 'Show All Types';
        return selected.join(', ');
      }}
      IconComponent={() => <FilterIcon />}
    >
      {TRANSACTION_TYPES.map((type) => (
        <MenuItem key={type} value={type} style={getStyles(type, types, theme)}>
          {startCase(type)}
        </MenuItem>
      ))}
    </Select>
  );
}
