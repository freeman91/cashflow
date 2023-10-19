import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, InputAdornment, List, ListItem, Stack } from '@mui/material';

import { TextFieldListItem } from '../List/TextFieldListItem';
import { postAccount, putAccount } from '../../store/accounts';
import { openDialog } from '../../store/dialogs';

const defaultState = {
  name: '',
  url: '',
  description: '',
};

export default function AccountForm({ mode, account, handleClose }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState(defaultState);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  useEffect(() => {
    if (!isEmpty(account)) {
      setValues(account);
    } else {
      setValues(defaultState);
    }
  }, [account, allAssets, allDebts]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleCreate = () => {
    try {
      dispatch(postAccount(values));
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  };

  const handleUpdate = () => {
    dispatch(putAccount(values));
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      handleCreate();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleClose();
    }
  };

  const handleCreateClick = (type) => {
    dispatch(
      openDialog({
        mode: 'create',
        attrs: {
          type,
          account_id: account.id,
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <List>
        <TextFieldListItem
          id='name'
          label='name'
          value={values.name}
          onChange={handleChange}
        />
        <TextFieldListItem
          id='url'
          label='link'
          value={values.url}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <OpenInNewIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextFieldListItem
          id='description'
          label='description'
          value={values.description}
          onChange={handleChange}
        />

        <ListItem>
          <Stack
            direction='row'
            spacing={2}
            sx={{ width: '100%' }}
            justifyContent='flex-end'
          >
            {mode === 'create' ? (
              <Button
                type='submit'
                id='submit'
                variant='contained'
                color='primary'
                onClick={handleCreate}
              >
                Create
              </Button>
            ) : (
              <>
                <Button
                  id='new-asset'
                  variant='outlined'
                  onClick={() => handleCreateClick('asset')}
                  color='secondary'
                >
                  + Asset
                </Button>
                <Button
                  id='new-debt'
                  variant='outlined'
                  onClick={() => handleCreateClick('debt')}
                  color='secondary'
                >
                  + Debt
                </Button>
                <Button
                  type='submit'
                  id='update'
                  variant='contained'
                  onClick={handleUpdate}
                  color='primary'
                >
                  Update
                </Button>
              </>
            )}
          </Stack>
        </ListItem>
      </List>
    </form>
  );
}
