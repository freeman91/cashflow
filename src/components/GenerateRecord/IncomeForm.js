import React, { useState, useEffect } from 'react';
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

import { postIncome } from '../../store/incomes';

const default_state = {
  amount: '',
  deductions: {},
  type: '',
  source: '',
  description: '',
  date: new Date(),
};

export default function IncomeForm({ handleDialogClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);

  useEffect(() => {
    var _deductions = {};
    user.income.deductions.forEach((deduction) => {
      _deductions[deduction] = '';
    });
    setValues({
      ...values,
      deductions: _deductions,
    });
  }, [user]);

  const handleSubmit = () => {
    try {
      var _deductions = {};
      Object.keys(values.deductions).forEach((deduction) => {
        _deductions[deduction] = values.deductions[deduction];
      });

      const new_income = {
        amount: Number(values.amount),
        deductions: _deductions,
        type: values.type,
        source: values.source,
        description: values.description,
        date: dayjs(values.date).format('MM-DD-YYYY'),
      };
      dispatch(postIncome(new_income));
    } catch (error) {
      console.error(error);
    } finally {
      handleDialogClose();
    }
  };

  const validate = () => {
    if (
      isNaN(values.amount) ||
      values.type.length === 0 ||
      !values.source ||
      values.source.length === 0 ||
      !values.date
    )
      return false;
    else return true;
  };

  const renderDeductions = () => {
    if (values.type !== 'paycheck') return null;

    return (
      <>
        <Typography>Deductions</Typography>
        {Object.keys(values.deductions).map((deduction) => {
          return (
            <TextField
              sx={{
                width: '45%',
                margin: '.5rem',
              }}
              key={`${deduction}-input`}
              id={`${deduction}-input`}
              label={`${deduction}`}
              name={`${deduction}`}
              required
              value={values.deductions[deduction]}
              variant='outlined'
              placeholder='0'
              onChange={(e) =>
                setValues({
                  ...values,
                  deductions: {
                    ...values.deductions,
                    [deduction]: e.target.value,
                  },
                })
              }
              margin='dense'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          );
        })}
      </>
    );
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
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        {renderDeductions()}
        <Autocomplete
          data-lpignore='true'
          id='type-select'
          autoComplete
          freeSolo
          value={values.type}
          options={user.income.types}
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
