import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

import { openDialog } from '../store/dialogs';
import { Button, Popover, Stack } from '@mui/material';

function NewTransactionButton(props) {
  const { transactionTypes } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeClick = (type) => {
    dispatch(openDialog({ type, mode: 'create' }));
    handleClose();
  };

  return (
    <>
      <Fab
        color='primary'
        onClick={handleClick}
        sx={{
          zIndex: 9999,
          position: 'fixed',
          bottom: 16,
          left: 16,
          boxShadow: 'none',
        }}
      >
        <AddIcon />
      </Fab>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ sx: { backgroundImage: 'none' } }}
      >
        <Stack
          direction='column'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
        >
          {transactionTypes.map((type) => (
            <Button
              key={type}
              variant='contained'
              onClick={() => handleTypeClick(type)}
            >
              {type}
            </Button>
          ))}
        </Stack>
      </Popover>
    </>
  );
}

export default NewTransactionButton;
