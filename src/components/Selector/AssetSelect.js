import React from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { ASSET } from '../Forms/AccountForm';

function AssetSelect(props) {
  const { accountId, onChange } = props;

  const assets = useSelector((state) =>
    state.accounts.data.filter((account) => account.account_type === ASSET)
  );

  const handleChangeAsset = (e) => {
    if (e.target.value === '') return;
    onChange(e.target.value);
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='asset-label'>asset</InputLabel>
      <Select
        labelId='asset-label'
        id='item_id'
        value={accountId || ''}
        onChange={handleChangeAsset}
        label='Asset'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <MenuItem value={''}>none</MenuItem>
        {sortBy(assets, 'name ').map((asset) => (
          <MenuItem
            key={asset.account_id}
            id={`${asset.account_id}-menu-item`}
            value={asset.account_id}
          >
            {asset.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AssetSelect;
