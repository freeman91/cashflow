import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function IncomeDialog() {
  const { mode } = useSelector((state) => state.dialogs.income);
  const [income] = useState({});

  return (
    <BaseDialog type='income' title={`${mode} income`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='income_id'
            value={income?.income_id}
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

export default IncomeDialog;
