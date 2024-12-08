import React from 'react';
import { useDispatch } from 'react-redux';
import { goBack } from 'redux-first-history';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

const BackButton = () => {
  const dispatch = useDispatch();

  return (
    <IconButton size='medium' onClick={() => dispatch(goBack())}>
      <ArrowBackIcon sx={{ color: 'button' }} />
    </IconButton>
  );
};

export default BackButton;
