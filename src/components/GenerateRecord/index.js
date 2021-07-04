import React, { useState } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { IconButton } from '@material-ui/core';

import RecordGenerationDialog from './Dialog';

export default function GenerateRecordButton() {
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
      >
        <AddBoxIcon sx={{ transform: 'scale(1.8)' }} />
      </IconButton>
      <RecordGenerationDialog open={dialogOpen} handleClose={handleClose} />
    </>
  );
}
