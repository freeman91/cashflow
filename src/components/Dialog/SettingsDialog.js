import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@mui/material';

export default function SettingsDialog({
  mode,
  handleClose,
  handleSubmit,
  handleDelete,
  selectedItem,
  selectedType,
}) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(selectedItem);
  }, [selectedItem]);

  const onSubmit = (e) => {
    handleSubmit(e, text);
    setText('');
  };

  return (
    <Dialog open={mode !== ''} onClose={handleClose}>
      <DialogTitle id='settings-dialog-title'>
        {mode === 'add'
          ? `Add to ${selectedType}`
          : `Update value in ${selectedType}`}
      </DialogTitle>
      <DialogContent sx={{ width: '25rem' }}>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            value={text}
            variant='outlined'
            margin='dense'
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            id='cancel'
            sx={{ mr: '1rem', mt: '1rem', width: '5rem' }}
            variant='outlined'
            color='info'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            id='submit'
            sx={{ mt: '1rem', mr: '1rem', width: '5rem' }}
            variant='outlined'
            onClick={onSubmit}
            color={'success'}
          >
            {mode === 'update' ? 'Update' : 'Add'}
          </Button>
          {mode === 'update' ? (
            <Button
              id='delete'
              sx={{ mt: '1rem', mr: '1rem', width: '5rem' }}
              variant='outlined'
              onClick={handleDelete}
              color={'error'}
            >
              Delete
            </Button>
          ) : null}
        </form>
      </DialogContent>
    </Dialog>
  );
}
