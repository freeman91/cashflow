import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function PaycheckTemplateSelect(props) {
  const { selected, handleSelect } = props;

  const paycheckTemplates = useSelector((state) => {
    return state.paychecks.data.filter((paycheck) =>
      paycheck.paycheck_id.startsWith('paycheck:template')
    );
  });
  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='paycheck_id-label'>paycheck template</InputLabel>
      <Select
        labelId='paycheck_id-label'
        id='paycheck_id'
        value={get(selected, 'paycheck_id', '')}
        onChange={handleSelect}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{ MenuListProps: { disablePadding: true } }}
      >
        <MenuItem key='none' id='none-menu-item' value=''>
          none
        </MenuItem>
        {paycheckTemplates.map((paycheck) => (
          <MenuItem
            key={paycheck.paycheck_id}
            id={`${paycheck.paycheck_id}-menu-item`}
            value={paycheck.paycheck_id}
          >
            {paycheck.employer}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PaycheckTemplateSelect;
