import React from 'react';

import ToggleButton from '@mui/material/ToggleButton';

export default function CustomToggleButton(props) {
  return <ToggleButton {...props} sx={{ py: 0.5, color: 'text.secondary' }} />;
}
