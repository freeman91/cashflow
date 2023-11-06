import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function SaleDialog() {
  const { mode } = useSelector((state) => state.dialogs.sale);
  const [sale] = useState({});

  return (
    <BaseDialog type='sale' title={`${mode} asset sale`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='sale_id'
            value={sale?.sale_id}
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

export default SaleDialog;
