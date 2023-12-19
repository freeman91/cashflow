import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function RepaymentDialog() {
  const { mode } = useSelector((state) => state.dialogs.repayment);
  const [repayment] = useState({});

  return (
    <BaseDialog type='repayment' title={`${mode} debt repayment`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='repayment_id'
            value={repayment?.repayment_id}
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

export default RepaymentDialog;
