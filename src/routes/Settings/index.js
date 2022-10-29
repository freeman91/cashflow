import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { concat, get, remove, sortBy, toArray } from 'lodash';
import { Grid, Typography } from '@mui/material';

import { putUserSettings } from '../../store/user';
import SettingsDialog from '../../components/Dialog/SettingsDialog';

export default function Settings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [selectedType, setSelectedType] = useState('expense_types');
  const [selectedItem, setSelectedItem] = useState('');
  const [dialogMode, setDialogMode] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(sortBy(get(user, selectedType)));
  }, [user, selectedType]);

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

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12}>
        <Typography align='left' variant='h5' sx={{ mb: '1rem' }}>
          Settings
        </Typography>
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
