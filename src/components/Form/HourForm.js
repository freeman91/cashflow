import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { Description as DescriptionIcon } from '@mui/icons-material';
import DatePicker from '@mui/lab/DatePicker';
import Autocomplete from '@mui/lab/Autocomplete';
import { Box, Button, InputAdornment, TextField } from '@mui/material';

import { postHour, putHour, deleteHour } from '../../store/hours';

const default_state = {
  amount: '',
  source: '',
  description: '',
  date: new Date(),
};

export default function HourForm({ handleDialogClose, mode, hour }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);

  useEffect(() => {
    if (mode === 'update') {
      setValues({
        amount: get(hour, 'amount', 0),
        source: get(hour, 'source', ''),
        description: get(hour, 'description', ''),
        date: new Date(get(hour, 'date')),
      });
    }
  }, [mode, hour]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const new_hour = {
      amount: Number(values.amount),
      source: values.source,
      description: values.description,
      date: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(postHour(new_hour));
    handleDialogClose();
  };

  const handleUpdate = () => {
    let updatedHour = {
      ...hour,
      ...values,
      date: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(putHour(updatedHour));
    handleDialogClose();
  };

  const handleDelete = () => {
    dispatch(deleteHour(get(hour, '_id')));
    handleDialogClose();
  };

  const handleFormEnterClick = () => {
    if (mode === 'create') {
      handleSubmit();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleDialogClose();
    }
  };

  const hourDiff = () => {
    if (
      values.amount === get(hour, 'amount') &&
      values.source === get(hour, 'source') &&
      values.description === get(hour, 'description') &&
      dayjs(values.date).format('MM-DD-YYYY') === get(hour, 'date')
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Box>
      <form onSubmit={handleFormEnterClick}>
        <TextField
          fullWidth
          id='amount-input'
          label='amount'
          name='amount'
          required
          value={values.amount}
          variant='outlined'
          placeholder='0'
          onChange={(e) => setValues({ ...values, amount: e.target.value })}
          margin='dense'
        />
        <Autocomplete
          id='source-select'
          autoComplete
          autoHighlight
          autoSelect
          freeSolo
          value={values.source}
          options={user.income.sources}
          getOptionLabel={(option) => option}
          onChange={(e, value) =>
            setValues({ ...values, source: value ? value : '' })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label='source'
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
        <DatePicker
          label='date'
          value={values.date}
          onChange={(value) => {
            setValues({ ...values, date: value });
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
            sx={{ mt: '1rem' }}
            variant='outlined'
            onClick={handleSubmit}
            color='success'
          >
            Submit
          </Button>
        ) : (
          <>
            <Button
              type='submit'
              id='update'
              disabled={!hourDiff()}
              sx={{ mt: '1rem' }}
              variant='outlined'
              onClick={handleUpdate}
              color='success'
            >
              Update
            </Button>
            <Button
              id='delete'
              sx={{ mt: '1rem', ml: '1rem' }}
              variant='outlined'
              onClick={handleDelete}
              color='error'
            >
              Delete
            </Button>
          </>
        )}
      </form>
    </Box>
  );
}
