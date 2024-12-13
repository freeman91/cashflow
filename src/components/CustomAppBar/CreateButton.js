import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

const CreateButton = (props) => {
  const { handleClick } = props;
  return (
    <IconButton size='medium' onClick={handleClick} color='info'>
      <AddIcon />
    </IconButton>
  );
};

export default CreateButton;
