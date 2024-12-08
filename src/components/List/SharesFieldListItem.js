import React from 'react';
import startCase from 'lodash/startCase';

import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextFieldListItem from './TextFieldListItem';

function SharesFieldListItem(props) {
  const { id, item, setItem, shares } = props;

  const handleMax = () => {
    setItem((_item) => ({ ..._item, [id]: shares }));
  };

  const handleChange = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setItem((_item) => ({ ..._item, [id]: e.target.value }));
    }
  };

  return (
    <TextFieldListItem
      id={id}
      label={startCase(id).toLowerCase()}
      placeholder='0.00'
      value={item[id] || ''}
      onChange={handleChange}
      inputProps={{ inputMode: 'decimal' }}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <Button onClick={handleMax}>MAX</Button>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SharesFieldListItem;
