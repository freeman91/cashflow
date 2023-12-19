import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function PurchaseDialog() {
  const { mode } = useSelector((state) => state.dialogs.purchase);
  const [purchase] = useState({});

  return (
    <BaseDialog type='purchase' title={`${mode} asset purchase`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='purchase_id'
            value={purchase?.purchase_id}
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

export default PurchaseDialog;
