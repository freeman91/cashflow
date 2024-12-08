import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const EditButton = (props) => {
  const { handleClick } = props;
  return (
    <IconButton size='medium' onClick={handleClick}>
      <EditIcon sx={{ color: 'button' }} />
    </IconButton>
  );
};

export default EditButton;
