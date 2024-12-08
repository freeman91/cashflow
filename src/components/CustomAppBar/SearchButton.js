import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';

const SearchButton = () => {
  const dispatch = useDispatch();

  return (
    <IconButton size='medium' onClick={() => dispatch(push('/search'))}>
      <SearchIcon sx={{ color: 'button' }} />
    </IconButton>
  );
};

export default SearchButton;
