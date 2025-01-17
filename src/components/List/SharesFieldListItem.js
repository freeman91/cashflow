import React, { useState, useEffect } from 'react';
import find from 'lodash/find';
import startCase from 'lodash/startCase';

import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextFieldListItem from './TextFieldListItem';
import { useSelector } from 'react-redux';

function SharesFieldListItem(props) {
  const { id, value, onChange, securityId, mode } = props;

  const [shares, setShares] = useState(0);
  const securities = useSelector((state) => state.securities.data);

  useEffect(() => {
    const security = find(securities, { security_id: securityId });
    setShares(security?.shares);
  }, [securities, securityId]);

  const handleMax = () => {
    onChange(shares);
  };

  const handleChange = (e) => {
    const _value = e.target.value;
    if (_value === '' || (!isNaN(_value) && !isNaN(parseFloat(_value)))) {
      if (Number(_value) <= shares) {
        onChange(e.target.value);
      }
    }
  };

  return (
    <TextFieldListItem
      id={id}
      label={startCase(id).toLowerCase()}
      placeholder='0.00'
      value={value || ''}
      onChange={handleChange}
      inputProps={{ inputMode: 'decimal' }}
      InputProps={{
        endAdornment: mode === 'create' && (
          <InputAdornment position='end'>
            <Button onClick={handleMax}>MAX</Button>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SharesFieldListItem;
