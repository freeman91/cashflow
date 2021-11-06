import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import dayjs from 'dayjs';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import DatePicker from '@mui/lab/DatePicker';
import Autocomplete from '@mui/lab/Autocomplete';
import { Box, Button, InputAdornment, TextField } from '@mui/material';

import { _numberToCurrency } from '../../helpers/currency';
// import { putDebt } from '../../store/debts';

const default_state = {
  name: '',
  value: '',
  type: '',
  description: '',
  last_update: new Date(),
  asset: '',
};

export default function DebtForm({ handleDialogClose, mode, debt }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);

  useEffect(() => {
    if (mode === 'update') {
      setValues({
        name: get(debt, 'name', ''),
        value: get(debt, 'value', 0),
        type: get(debt, 'type', ''),
        description: get(debt, 'description', ''),
        last_update: new Date(get(debt, 'last_update')),
        asset: get(debt, 'asset', ''),
      });
    }
  }, [mode, debt]);

  const handleCreate = (e) => {
    e.preventDefault();
    const new_debt = {
      name: values.name,
      value: Number(values.value),
      type: values.type,
      description: values.description,
      last_update: dayjs(values.date).format('MM-DD-YYYY'),
      asset: values.asset,
    };
    console.log('new_debt: ', new_debt);
    // dispatch(postDebt(new_debt));
    handleDialogClose();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (validate()) {
      // let updatedDebt = {
      //   ...debt,
      //   ...values,
      //   last_update: dayjs(values.date).format('MM-DD-YYYY'),
      // };
      // dispatch(putDebt(updatedDebt));
      handleDialogClose();
    }
  };

  const handlePayment = () => {
    // dispatch(deleteDebt(get(debt, '_id')));
    // console.log('delete');
    // handleDialogClose();
  };

  const handleFormEnterClick = () => {
    if (mode === 'create') {
      handleCreate();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleDialogClose();
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
      values.asset === get(debt, 'asset') &&
      values.description === get(debt, 'description') &&
      valueDate === debtDate
    ) {
      return false;
    } else {
      return true;
    }
  };

  let isCredit = values.type === 'credit';

  return (
    <Box>
      <form onSubmit={handleFormEnterClick}>
        <TextField
          fullWidth
          id='name-input'
          label='name'
          name='name'
          required
          value={values.name}
          variant='outlined'
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          margin='dense'
        />
        <TextField
          fullWidth
          id='value-input'
          label='value'
          name='value'
          disabled={!isCredit}
          required={isCredit}
          value={_numberToCurrency.format(values.value)}
          variant='outlined'
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
        <Autocomplete
          data-lpignore='true'
          disabled
          id='type-select'
          autoComplete
          freeSolo
          value={values.type}
          options={user.debt.types}
          getOptionLabel={(option) => option}
          onChange={(e, value) => setValues({ ...values, type: value })}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label='type'
              variant='outlined'
              margin='dense'
            />
          )}
        />
        <TextField
          fullWidth
          id='description-input'
          label='description'
          name='description'
          value={values.description}
          variant='outlined'
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
        {/* TODO: asset selector */}
        {/* <TextField
          fullWidth
          id='description-input'
          label='description'
          name='description'
          value={values.description}
          variant='outlined'
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
        /> */}
        <DatePicker
          disabled
          label='date'
          value={values.last_update}
          onChange={(value) => {
            setValues({ ...values, last_update: value });
          }}
          renderInput={(params) => (
            <TextField fullWidth {...params} margin='dense' required />
          )}
        />
        <Button
          id='cancel'
          sx={{ mr: '1rem', mt: '1rem', width: '5rem' }}
          variant='outlined'
          color='info'
          onClick={handleDialogClose}
        >
          Cancel
        </Button>
        {mode === 'create' ? (
          <Button
            type='submit'
            id='submit'
            disabled={!validate()}
            sx={{ mt: '1rem' }}
            variant='outlined'
            onClick={handleCreate}
            color='success'
          >
            Submit
          </Button>
        ) : (
          <>
            {isCredit ? (
              <Button
                type='submit'
                id='update'
                disabled={!validate() || !debtDiff()}
                sx={{ mt: '1rem' }}
                variant='outlined'
                onClick={handleUpdate}
                color='success'
              >
                Update
              </Button>
            ) : (
              <Button
                id='payment'
                sx={{ mt: '1rem', ml: '1rem' }}
                variant='outlined'
                onClick={handlePayment}
                color='success'
              >
                Payment
              </Button>
            )}
          </>
        )}
      </form>
    </Box>
  );
}
