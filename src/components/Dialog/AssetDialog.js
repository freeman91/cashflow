import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function AssetDialog() {
  const { mode } = useSelector((state) => state.dialogs.asset);
  const [asset] = useState({});

  return (
    <BaseDialog type='asset' title={`${mode} asset`}>
      <List>
        {mode !== 'create' && (
          <TextFieldListItem
            id='asset_id'
            value={asset?.asset_id}
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

export default AssetDialog;
