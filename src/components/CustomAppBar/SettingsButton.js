import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';

const SettingsButton = () => {
  const dispatch = useDispatch();

  return (
    <IconButton size='medium' onClick={() => dispatch(push('/settings'))}>
      <SettingsIcon sx={{ color: 'button' }} />
    </IconButton>
  );
};

export default SettingsButton;
