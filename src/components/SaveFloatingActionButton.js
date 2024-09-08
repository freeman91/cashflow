import React from 'react';

import SaveIcon from '@mui/icons-material/Save';
import Fab from '@mui/material/Fab';

export default function SaveFloatingActionButton(props) {
  const { onSave } = props;

  return (
    <Fab
      color='primary'
      sx={{ position: 'fixed', right: 15, bottom: 85 }}
      onClick={onSave}
    >
      <SaveIcon />
    </Fab>
  );
}
