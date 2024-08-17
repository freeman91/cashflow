import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useMediaQuery } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { closeDialog } from '../../store/dialogs';
import DialogTitleOptions from './DialogTitleOptions';

function BaseDialog(props) {
  const {
    type,
    title,
    titleOptions,
    children,
    handleClose = null,
    disableGutters = false,
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const { open, mode } = useSelector((state) => state.dialogs[type]);

  const handleCloseBase = () => {
    dispatch(closeDialog(type));
    if (handleClose) handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paperFullScreen': {
          backgroundColor: '#202020',
          backgroundImage: 'unset',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        {title}
        <DialogTitleOptions mode={mode} handleClose={handleCloseBase}>
          {titleOptions}
        </DialogTitleOptions>
      </DialogTitle>
      <DialogContent
        sx={{
          minWidth: 400,
          pb: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: disableGutters ? 1 : 2,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default BaseDialog;
