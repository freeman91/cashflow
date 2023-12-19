import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import useTheme from '@mui/material/styles/useTheme';
// import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { closeDialog } from '../../store/dialogs';
import DialogTitleOptions from './DialogTitleOptions';

function BaseDialog(props) {
  const { type, title, titleOptions, actions, children } = props;
  // const theme = useTheme();
  const dispatch = useDispatch();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { open, mode } = useSelector((state) => state.dialogs[type]);

  const handleClose = () => {
    dispatch(closeDialog(type));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      // fullScreen={fullScreen}
    >
      <DialogTitle sx={{ pb: 0 }}>
        {title}
        <DialogTitleOptions mode={mode} handleClose={handleClose}>
          {titleOptions}
        </DialogTitleOptions>
      </DialogTitle>
      <DialogContent
        sx={{
          minWidth: 300,
          pb: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>cancel</Button>
        {actions}
      </DialogActions>
    </Dialog>
  );
}

export default BaseDialog;
