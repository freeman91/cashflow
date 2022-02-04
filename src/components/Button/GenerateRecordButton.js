import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';

import RecordGenerationDialog from '../Dialog/GenerateRecordDialog';
import { sleep } from '../../helpers/util';

export default function GenerateRecordButton({ refresh }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleClose = async () => {
    setDialogOpen(false);
    if (refresh) {
      await sleep(1000);
      refresh();
    }
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
        <AddCircleIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
      <RecordGenerationDialog open={dialogOpen} handleClose={handleClose} />
    </>
  );
}
