import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function CreateDialog(props) {
  const { open, handleClose, title, children } = props;
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id='create-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        {React.Children.map(children, (child) => {
          if (child !== null) {
            return React.cloneElement(child, {
              handleClose: handleClose,
            });
          }
        })}
      </DialogContent>
    </Dialog>
  );
}
