import React from 'react';
import includes from 'lodash/includes';
import map from 'lodash/map';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function TypeFilter(props) {
  const { typeFilter, setTypeFilter, options } = props;

  const handleClick = (event) => {
    if (includes(typeFilter, event.target.innerText)) {
      setTypeFilter(
        typeFilter.filter((item) => item !== event.target.innerText)
      );
    } else {
      setTypeFilter([...typeFilter, event.target.innerText]);
    }
  };

  return (
    <Stack direction='row' spacing={1}>
      {map(options, (option) => {
        const variant = includes(typeFilter, option) ? 'filled' : 'outlined';
        return <Chip label={option} onClick={handleClick} variant={variant} />;
      })}
    </Stack>
  );
}
