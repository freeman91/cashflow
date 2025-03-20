import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { ASSET } from '../Forms/AccountForm';

function AssetSelect(props) {
  const { accountId, onChange } = props;

  const accounts = useSelector((state) => state.accounts.data);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    setAssets(
      sortBy(
        accounts.filter((account) => account.account_type === ASSET),
        'name'
      )
    );
  }, [accounts]);

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
        {assets.map((asset) => (
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
