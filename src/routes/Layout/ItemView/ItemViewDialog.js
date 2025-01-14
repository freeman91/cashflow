import React from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';

import { closeItemView } from '../../../store/itemView';
import { getForm } from './ItemViewDrawer';

function ItemViewDialog(props) {
  const { itemType, mode, attrs } = props;

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const Form = getForm(itemType);

  return (
    <Dialog fullScreen={true} open={true} onClose={handleClose}>
      <DialogTitle sx={{ pb: 0 }}>
        {`${startCase(mode)} ${startCase(itemType)}`}
        <Box style={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          pb: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: 0,
          width: '100%',
        }}
      >
        <List sx={{ px: 2, width: '100%' }}>
          <Form mode={mode} attrs={attrs} />
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default ItemViewDialog;
