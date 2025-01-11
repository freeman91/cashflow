import React from 'react';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import TextFieldListItem from './TextFieldListItem';

function IntegerFieldListItem(props) {
  const { id, item, setItem } = props;

  const handleChange = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseInt(e.target.value)))
    ) {
      setItem((_item) => ({ ..._item, [id]: e.target.value }));
    }
  };

  return (
    <TextFieldListItem
      id={id}
      label={startCase(id).toLowerCase()}
      placeholder='0'
      value={get(item, id) || ''}
      onChange={handleChange}
      inputProps={{ inputMode: 'numeric' }}
    />
  );
}

export default IntegerFieldListItem;
