import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import RecordGenerationDialog from './Dialog';

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: 'auto',
  },
}));

export default function GenerateRecordButton() {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  // const { user } = useSelector((state) => state.user);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        className={classes.button}
        onClick={handleButtonClick}
      >
        Generate Record
      </Button>
      <RecordGenerationDialog open={dialogOpen} handleClose={handleClose} />
    </>
  );
}
