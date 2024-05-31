import * as React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function NativeTypeSelect(props) {
  const { selected } = props;
  const dispatch = useDispatch();

  const handleClick = (e) => {
    dispatch(push(`/search/${e.target.value}`));
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormControl fullWidth>
        <NativeSelect defaultValue={selected} inputProps={{ name: 'type' }}>
          <option value='expenses' onClick={handleClick}>
            expenses
          </option>
          <option value='incomes' onClick={handleClick}>
            incomes
          </option>
          <option value='bills' onClick={handleClick}>
            bills
          </option>
          <option value='accounts' onClick={handleClick}>
            account
          </option>
        </NativeSelect>
      </FormControl>
    </Box>
  );
}
