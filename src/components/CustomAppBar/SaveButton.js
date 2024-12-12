import React from 'react';

import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const SaveButton = ({ show = true, onClick, tooltipTitle = 'save' }) => {
  if (!show) return <Box width='40px' height='35px' />;
  return (
    <Tooltip title={tooltipTitle} placement='left'>
      <IconButton size='medium' onClick={onClick}>
        <SaveIcon sx={{ color: 'button' }} />
      </IconButton>
    </Tooltip>
  );
};

export default SaveButton;
