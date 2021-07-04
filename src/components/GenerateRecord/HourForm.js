import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons';
import DatePicker from '@material-ui/lab/DatePicker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';

import { postHour } from '../../store/hours';

const default_state = {
  amount: '',
  source: '',
  description: '',
  date: new Date(),
};

export default function HourForm({ handleDialogClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);

  const handleSubmit = () => {
    try {
      const new_hour = {
        amount: Number(values.amount),
        source: values.source,
        description: values.description,
        date: dayjs(values.date).format('MM-DD-YYYY'),
      };
      dispatch(postHour(new_hour));
    } catch (error) {
      console.error(error);
    } finally {
      handleDialogClose();
    }
  };

  const validate = () => {
    if (
      isNaN(values.amount) ||
      !values.source ||
      values.source.length === 0 ||
      !values.date
    )
      return false;
    else return true;
  };

  return (
    <Box>
      <form id='search'>
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
          freeSolo
          value={values.source}
          options={user.income.sources}
          getOptionLabel={(option) => option}
          onChange={(e, value) => setValues({ ...values, source: value })}
          autoSelect
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
          id='submit'
          disabled={!validate()}
          sx={{ marginTop: '1rem', width: '100%' }}
          variant='contained'
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
