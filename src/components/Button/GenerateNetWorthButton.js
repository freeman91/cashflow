import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';

import NetWorthGenerationDialog from '../Dialog/GenerateNetWorthDialog';

export default function GenerateNetWorthButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label='create'
        color='primary'
        onClick={handleButtonClick}
        component='span'
        variant='contained'
        sx={{ marginRight: '1rem' }}
      >
        <AddCircleIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
      <NetWorthGenerationDialog open={dialogOpen} handleClose={handleClose} />
    </>
  );
}
