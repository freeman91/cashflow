import React from 'react';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextFieldListItem from './TextFieldListItem';

function DecimalFieldListItem(props) {
  const { id, value, onChange, startAdornment = <AttachMoneyIcon /> } = props;

  const handleClear = () => onChange('');

  const handleChange = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      onChange(e.target.value);
    }
  };

  return (
    <TextFieldListItem
      id={id}
      label={id.toLowerCase().replace(/_/g, ' ')}
      placeholder='0.00'
      value={value || ''}
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
