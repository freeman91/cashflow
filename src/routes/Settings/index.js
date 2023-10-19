import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { map, startCase } from 'lodash';

import AddIcon from '@mui/icons-material/Add';
import { IconButton, MenuItem, Select, Stack } from '@mui/material';

import BillsTable from './BillsTable';
import { openDialog } from '../../store/dialogs';
import EditStringList from './EditStringList';

const OPTIONS = [
  'bills',
  'expense_types',
  'expense_vendors',
  'income_types',
  'income_sources',
  'asset_types',
  'debt_types',
];

export default function Settings() {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(OPTIONS[0]);

  const handleClick = () => {
    if (selected === OPTIONS[0]) {
      dispatch(
        openDialog({
          mode: 'create',
          attrs: {
            type: 'bill',
          },
        })
      );
    }
  };

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={2}
      >
        {selected === 'bills' ? (
          <IconButton onClick={handleClick}>
            <AddIcon />
          </IconButton>
        ) : null}
        <Select
          variant='standard'
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
          }}
          sx={{ minWidth: 200 }}
        >
          {map(OPTIONS, (option) => (
            <MenuItem key={option} value={option}>
              {startCase(option)}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {selected === 'bills' ? (
          <BillsTable />
        ) : (
          <EditStringList settingName={selected} />
        )}
      </div>
    </>
  );
}
