import React from 'react';
import { useDispatch } from 'react-redux';

import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { saveNetworth } from '../../store/networths';

const SaveButton = (props) => {
  const dispatch = useDispatch();
  return (
    <Tooltip title='save current networth' placement='left'>
      <IconButton size='medium' onClick={() => dispatch(saveNetworth())}>
        <SaveIcon sx={{ color: 'button' }} />
      </IconButton>
    </Tooltip>
  );
};

export default SaveButton;
