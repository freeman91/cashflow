import React from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
// import TextFieldListItem from '../List/TextFieldListItem';

import BaseDialog from './BaseDialog';

function NetworthDialog() {
  const { mode } = useSelector((state) => state.dialogs.networth);
  // const [networth] = useState({});

  return (
    <BaseDialog type='networth' title={`${mode} networth`}>
      <List>
        {/* {mode !== 'create' && (
          <TextFieldListItem
            id='networth_id'
            value={networth?.networth_id}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
            }}
          />
        )} */}
      </List>
    </BaseDialog>
  );
}

export default NetworthDialog;
