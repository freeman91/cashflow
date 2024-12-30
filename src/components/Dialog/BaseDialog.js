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
    titleOptions = null,
    handleClose = null,
    disableGutters = false,
    children,
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const { open } = useSelector((state) => state.dialogs[type]);

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
          backgroundColor: 'surface.200',
          backgroundImage: 'unset',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        {title}
        <DialogTitleOptions handleClose={handleCloseBase}>
          {titleOptions}
        </DialogTitleOptions>
      </DialogTitle>
      <DialogContent
        sx={{
          pb: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: disableGutters ? 1 : 2,
          minWidth: '350px',
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default BaseDialog;
