import React from 'react';
import { useSelector } from 'react-redux';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { sortBy } from 'lodash';

function AssetSelect(props) {
  const { resource, setResource } = props;

  const assets = useSelector((state) => state.assets.data);

  const handleChangeAsset = (e) => {
    if (e.target.value === '') return;
    setResource({ ...resource, asset_id: e.target.value });
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='asset-label'>asset</InputLabel>
      <Select
        labelId='asset-label'
        id='item_id'
        value={resource.asset_id}
        onChange={handleChangeAsset}
        label='Asset'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {sortBy(assets, 'name ').map((asset) => (
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

export default AssetSelect;
