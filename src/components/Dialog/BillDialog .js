import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function BillDialog() {
  const { mode } = useSelector((state) => state.dialogs.bill);
  const [bill] = useState({});

  return (
    <BaseDialog type='bill' title={`${mode} bill`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='bill_id'
            value={bill?.bill_id}
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

export default BillDialog;
