import React from 'react';
import startCase from 'lodash/startCase';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextFieldListItem from './TextFieldListItem';

function DecimalFieldListItem(props) {
  const { id, item, setItem, startAdornment = <AttachMoneyIcon /> } = props;

  const handleClear = () => setItem((_item) => ({ ..._item, [id]: '' }));

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
        startAdornment: startAdornment ? (
          <InputAdornment position='start'>{startAdornment}</InputAdornment>
        ) : null,
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default DecimalFieldListItem;
