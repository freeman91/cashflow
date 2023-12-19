import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function PaycheckDialog() {
  const { mode } = useSelector((state) => state.dialogs.paycheck);
  const [paycheck] = useState({});

  return (
    <BaseDialog type='paycheck' title={`${mode} paycheck`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='paycheck_id'
            value={paycheck?.paycheck_id}
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

export default PaycheckDialog;
