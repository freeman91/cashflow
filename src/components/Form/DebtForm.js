import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { find, get, map } from 'lodash';
import dayjs from 'dayjs';

import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Button,
  InputAdornment,
  TextField,
  Stack,
  List,
  ListItem,
} from '@mui/material';

import { deleteDebt, postDebt, putDebt } from '../../store/debts';
import { TextFieldListItem } from '../List/TextFieldListItem';
import { AutocompleteListItem } from '../List/AutocompleteListItem';

const defaultState = {
  account_id: '',
  name: '',
  value: '',
  type: '',
  description: '',
  last_update: new Date(),
  vendor: '',
};

export default function DebtForm(props) {
  const { handleClose, mode, debt } = props;
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(defaultState);

  useEffect(() => {
    if (mode === 'update') {
      setValues({
        account_id: get(debt, 'account_id', ''),
        name: get(debt, 'name', ''),
        value: get(debt, 'value', 0),
        type: get(debt, 'type', ''),
        vendor: get(debt, 'vendor', ''),
        description: get(debt, 'description', ''),
        last_update: new Date(get(debt, 'last_update')),
      });
    }
    if (mode === 'create') {
      setValues({
        ...defaultState,
        account_id: get(debt, 'account_id', ''),
      });
    }
  }, [mode, debt]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (validate()) {
      const newDebt = {
        account_id: values.account_id,
        name: values.name,
        value: Number(values.value),
        type: values.type,
        vendor: values.vendor,
        description: values.description,
      };
      dispatch(postDebt(newDebt));
      handleClose();
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (validate()) {
      let updatedDebt = {
        ...debt,
        value: Number(values.value),
        name: values.name,
        description: values.description,
      };
      dispatch(putDebt(updatedDebt));
      handleClose();
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteDebt(debt.id));
    handleClose();
  };

  const handleFormEnterClick = () => {
    if (mode === 'create') {
      handleCreate();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleClose();
    }
  };

  const validate = () => {
    if (
      isNaN(values.value) ||
      !values.name ||
      values.type.length === 0 ||
      !values.last_update
    )
      return false;
    else return true;
  };

  const debtDiff = () => {
    let valueDate = String(dayjs(values.last_update).format('MM-DD-YYYY'));
    let debtDate = String(debt.last_update);
    if (
      values.name === get(debt, 'name') &&
      values.value === get(debt, 'value') &&
      values.price === get(debt, 'price') &&
      values.type === get(debt, 'type') &&
      values.vendor === get(debt, 'vendor') &&
      values.description === get(debt, 'description') &&
      valueDate === debtDate
    ) {
      return false;
    } else {
      return true;
    }
  };

  const renderButtons = () => {
    let buttons = [];

    if (mode === 'create') {
      buttons.push(
        <Button
          type='submit'
          id='submit'
          key='create-button'
          disabled={!validate()}
          variant='outlined'
          onClick={handleCreate}
          color='success'
        >
          Submit
        </Button>
      );
    } else {
      buttons.push(
        <Button
          type='submit'
          id='update'
          key='update-button'
          disabled={!validate() || !debtDiff()}
          variant='contained'
          onClick={handleUpdate}
          color='success'
        >
          Update
        </Button>,
        <Button
          id='delete'
          key='delete-button'
          variant='outlined'
          onClick={handleDelete}
          color='error'
        >
          Delete
        </Button>
      );
    }

    return (
      <ListItem>
        <Stack
          direction='row'
          justifyContent='flex-end'
          spacing={2}
          sx={{ width: '100%' }}
        >
          {map(buttons, (button) => button)}
        </Stack>
      </ListItem>
    );
  };

  return (
    <form onSubmit={handleFormEnterClick}>
      <List>
        <TextFieldListItem
          id='account-input'
          label='account'
          name='account'
          value={find(accounts, { id: values.account_id })?.name}
          variant='standard'
          margin='dense'
          InputProps={{
            readOnly: true,
            disableUnderline: true,
          }}
        />

        <TextFieldListItem
          id='name-input'
          label='name'
          name='name'
          value={values.name}
          variant='standard'
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          margin='dense'
          fullWidth
        />
        <AutocompleteListItem
          data-lpignore='true'
          id='type-select'
          autoComplete
          autoHighlight
          autoSelect
          freeSolo
          disabled={mode === 'update'}
          value={values.type}
          options={user.debt_types}
          getOptionLabel={(option) => option}
          onChange={(e, value) =>
            setValues({ ...values, type: value ? value : '' })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              disabled={mode === 'update'}
              label='type'
              variant='standard'
              margin='dense'
              fullWidth
              InputProps={{
                readOnly: mode === 'update',
              }}
            />
          )}
        />
        <TextFieldListItem
          fullWidth
          type='number'
          id='value-input'
          label='current value'
          name='value'
          value={Math.round(values.value * 100) / 100}
          variant='standard'
          placeholder='0'
          onChange={(e) => setValues({ ...values, value: e.target.value })}
          margin='dense'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextFieldListItem
          fullWidth
          id='description'
          label='description'
          name='description'
          value={values.description}
          variant='standard'
          margin='dense'
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <DescriptionIcon />
              </InputAdornment>
            ),
          }}
        />
        <ListItem>
          <DatePicker
            disabled
            label='date'
            value={values.last_update}
            onChange={(value) => {
              setValues({ ...values, last_update: value });
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                margin='dense'
                required
                variant='standard'
              />
            )}
          />
        </ListItem>
        {renderButtons()}
      </List>
    </form>
  );
}
