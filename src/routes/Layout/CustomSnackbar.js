import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

import { setSnackbar } from '../../store/appSettings';

export default function CustomSnackbar() {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.appSettings.snackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setSnackbar({ message: '' }));
  };

  const action = (
    <IconButton size='small' color='inherit' onClick={handleClose}>
      <CloseIcon fontSize='small' />
    </IconButton>
  );

  const open = message !== '';
  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      message={message}
      action={action}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{ mb: 2 }}
    />
  );
}
