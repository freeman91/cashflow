import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const EditButton = (props) => {
  const { handleClick } = props;
  return (
    <IconButton size='medium' onClick={handleClick} color='info'>
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;
