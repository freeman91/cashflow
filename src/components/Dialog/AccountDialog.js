import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function AccountDialog() {
  const { mode } = useSelector((state) => state.dialogs.account);
  const [account] = useState({});

  return (
    <BaseDialog type='account' title={`${mode} account`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='account_id'
            value={account?.account_id}
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

export default AccountDialog;
