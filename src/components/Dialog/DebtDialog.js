import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function DebtDialog() {
  const { mode } = useSelector((state) => state.dialogs.debt);
  const [debt] = useState({});

  return (
    <BaseDialog type='debt' title={`${mode} debt`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='debt_id'
            value={debt?.debt_id}
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

export default DebtDialog;
