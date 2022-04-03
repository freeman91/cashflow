import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { concat, get, map, remove, sortBy, toArray } from 'lodash';
import {
  Button,
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemText,
  List,
} from '@mui/material';

import { putUserSettings } from '../../store/user';
import SettingsDialog from '../../components/Dialog/SettingsDialog';

export default function Networth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [selectedType, setSelectedType] = useState('expense_types');
  const [selectedItem, setSelectedItem] = useState('');
  const [dialogMode, setDialogMode] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(sortBy(get(user, selectedType)));
  }, [user, selectedType]);

  const handleCellClick = (e) => {
    let item = e.target.textContent;
    setDialogMode('update');
    setSelectedItem(item);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setDialogMode('');
    setSelectedItem('');
  };

  const handleSubmit = (e, updatedItem) => {
    let _updatedList = toArray(get(user, selectedType));
    _updatedList = sortBy(concat(_updatedList, updatedItem));

    dispatch(putUserSettings({ updated: _updatedList, setting: selectedType }));
    handleClose(e);
  };

  const handleDelete = (e) => {
    let _updatedList = toArray(get(user, selectedType));
    remove(_updatedList, (item) => item === selectedItem);

    dispatch(putUserSettings({ updated: _updatedList, setting: selectedType }));
    handleClose(e);
  };

  const handleChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12}>
        <Typography align='left' variant='h5' sx={{ mb: '1rem' }}>
          User Settings
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Select
          variant='standard'
          id='type-select'
          value={selectedType}
          onChange={handleChange}
          sx={{ mb: '1rem', width: '10rem', mr: '2rem' }}
        >
          <MenuItem value={'expense_types'}>Expense Types</MenuItem>
          <MenuItem value={'expense_vendors'}>Expense Vendors</MenuItem>
          <MenuItem value={'income_types'}>Income Types</MenuItem>
          <MenuItem value={'income_sources'}>Income Sources</MenuItem>
          <MenuItem value={'income_deductions'}>Income Deductions</MenuItem>
          <MenuItem value={'asset_types'}>Asset Types</MenuItem>
          <MenuItem value={'debt_types'}>Debt Types</MenuItem>
        </Select>
        <Button variant='contained' onClick={() => setDialogMode('add')}>
          Insert
        </Button>
      </Grid>

      <Grid item xs={4} sx={{ mt: '1rem' }} justifyContent='center'>
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            boxShadow: '0px 0px 1px grey',
          }}
        >
          <List sx={{ overflow: 'auto', maxHeight: 800 }}>
            {map(items, (item) => {
              return (
                <ListItem disablePadding key={item}>
                  <ListItemButton onClick={handleCellClick}>
                    <ListItemText primary={item} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Grid>

      <SettingsDialog
        mode={dialogMode}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
        selectedItem={selectedItem}
        selectedType={selectedType}
      />
    </Grid>
  );
}
