import React from 'react';
import { useDispatch } from 'react-redux';

import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';

import { saveNetworth } from '../../store/networths';

const SaveButton = (props) => {
  const dispatch = useDispatch();
  return (
    <IconButton size='medium' onClick={() => dispatch(saveNetworth())}>
      <SaveIcon sx={{ color: 'button' }} />
    </IconButton>
  );
};

export default SaveButton;
