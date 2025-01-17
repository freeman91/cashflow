import React from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function SecuritySelect(props) {
  const { accountId, resource, setResource } = props;

  const securities = useSelector((state) =>
    state.securities.data.filter(
      (security) => security.account_id === accountId
    )
  );

  const handleChangeSecurity = (e) => {
    if (e.target.value === '') return;
    setResource({
      ...resource,
      security_id: e.target.value,
      account_id: accountId,
    });
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='security-label'>security</InputLabel>
      <Select
        labelId='security-label'
        id='security_id'
        value={resource.security_id || ''}
        onChange={handleChangeSecurity}
        label='Security'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{
          MenuListProps: {
            disablePadding: true,
            sx: {
              bgcolor: 'surface.300',
              '& .MuiPaper-root': { minWidth: 'unset' },
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
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        {sortBy(securities, 'name ').map((security) => (
          <MenuItem
            key={security.security_id}
            id={`${security.security_id}-menu-item`}
            value={security.security_id}
          >
            {security.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SecuritySelect;
