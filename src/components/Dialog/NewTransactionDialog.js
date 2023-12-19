import React from 'react';
import { useDispatch } from 'react-redux';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { closeDialog, openDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';

function NewTransactionDialog() {
  const dispatch = useDispatch();

  const handleClick = (type) => {
    dispatch(openDialog({ type, mode: 'create' }));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('newTransaction'));
  };

  return (
    <BaseDialog type='newTransaction' title='select type'>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        pb={1}
        sx={{ width: '50%', pt: 2 }}
      >
        {['expense', 'income', 'purchase', 'sale'].map((type) => (
          <Button
            key={type}
            fullWidth
            variant='contained'
            onClick={() => handleClick(type)}
          >
            {type}
          </Button>
        ))}
      </Stack>
    </BaseDialog>
  );
}

export default NewTransactionDialog;
