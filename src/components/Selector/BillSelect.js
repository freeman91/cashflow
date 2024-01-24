import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { sortBy } from 'lodash';

function BillSelect(props) {
  const { resource, setResource } = props;

  const bills = useSelector((state) => state.bills.data);

  const handleChangeBill = (e) => {
    setResource({ ...resource, bill_id: e.target.value });
  };

  return (
    <FormControl
      variant='standard'
      sx={{ width: '100%', maxWidth: 350, display: 'flex' }}
    >
      <InputLabel id='bill-label'>bill</InputLabel>
      <Select
        labelId='bill-label'
        id='item_id'
        value={get(resource, 'bill_id', '')}
        onChange={handleChangeBill}
        label='Bill'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <MenuItem key='none' id={`none-menu-item`} value={''}>
          None
        </MenuItem>
        {sortBy(bills, 'name ').map((bill) => (
          <MenuItem
            key={bill.bill_id}
            id={`${bill.bill_id}-menu-item`}
            value={bill.bill_id}
          >
            {bill.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default BillSelect;
