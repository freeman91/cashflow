import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';

export default function CreateButton({ children }) {
  const [open, setOpen] = useState(false);

  const handleButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        <AddCircleIcon sx={{ height: '1.75rem', width: '1.75rem' }} />
      </IconButton>
      {React.Children.map(children, (child) => {
        if (child !== null) {
          return React.cloneElement(child, {
            open: open,
            handleClose: handleClose,
          });
        }
      })}
    </>
  );
}
