import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function BorrowDialog() {
  const { mode } = useSelector((state) => state.dialogs.borrow);
  const [borrow] = useState({});

  return (
    <BaseDialog type='borrow' title={`${mode} borrow`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='borrow_id'
            value={borrow?.borrow_id}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
            }}
          />
        )}
      </List>
    </BaseDialog>
  );
}

export default BorrowDialog;
