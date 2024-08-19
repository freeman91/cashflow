import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';

function DepositToSelect(props) {
  const { resource, setResource } = props;

  const allAssets = useSelector((state) => state.assets.data);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    let _assets = filter(allAssets, (asset) => {
      return asset.can_deposit_to;
    });
    setAssets(sortBy(_assets, 'name'));
  }, [allAssets]);

  const handleChangeDebt = (e) => {
    setResource((prevResource) => ({
      ...prevResource,
      deposit_to_id: e.target.value,
    }));
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='deposit_to-label'>deposit to</InputLabel>
      <Select
        labelId='deposit_to-label'
        id='deposit_to'
        value={get(resource, 'deposit_to_id', '')}
        onChange={handleChangeDebt}
        label='Debt'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{ MenuListProps: { disablePadding: true } }}
      >
        <MenuItem key='none' id='none-menu-item' value=''>
          None
        </MenuItem>
        {assets.map((asset) => (
          <MenuItem
            key={asset.asset_id}
            id={`${asset.asset_id}-menu-item`}
            value={asset.asset_id}
          >
            {asset.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DepositToSelect;
