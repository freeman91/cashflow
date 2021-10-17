import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { get } from 'lodash';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import DatePicker from '@mui/lab/DatePicker';
import Autocomplete from '@mui/lab/Autocomplete';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { postIncome, putIncome, deleteIncome } from '../../store/incomes';

const default_state = {
  amount: '',
  deductions: {},
  type: '',
  source: '',
  description: '',
  date: new Date(),
};

export default function IncomeForm({ handleDialogClose, mode, income }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);
  const [initialDeductions, setInitialDeductions] = useState({});

  useEffect(() => {
    var _deductions = {};
    user.income.deductions.forEach((deduction) => {
      _deductions[deduction] = '';
    });
    setInitialDeductions(_deductions);
  }, [user.income.deductions]);

  useEffect(() => {
    let _deductions = get(income, 'deductions', {});
    if (Object.keys(_deductions).length === 0) {
      _deductions = initialDeductions;
    }

    if (mode === 'create') {
      setValues({ ...values, deductions: _deductions });
    } else if (mode === 'update') {
      setValues({
        amount: get(income, 'amount', 0),
        source: get(income, 'source', ''),
        type: get(income, 'type', ''),
        deductions: _deductions,
        description: get(income, 'description', ''),
        date: new Date(get(income, 'date')),
      });
    }
    // eslint-disable-next-line
  }, [mode, income, initialDeductions]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let _values = values;
    if (values.type !== 'paycheck') {
      _values.deductions = initialDeductions;
    }

    try {
      const new_income = {
        amount: Number(_values.amount),
        deductions: _values.deductions,
        type: _values.type,
        source: _values.source,
        description: _values.description,
        date: dayjs(_values.date).format('MM-DD-YYYY'),
      };
      dispatch(postIncome(new_income));
    } catch (error) {
      console.error(error);
    } finally {
      handleDialogClose();
    }
  };

  const handleUpdate = () => {
    let _values = values;
    if (values.type !== 'paycheck') {
      _values.deductions = initialDeductions;
    }

    if (validate()) {
      let updatedIncome = {
        ...income,
        ..._values,
        date: dayjs(_values.date).format('MM-DD-YYYY'),
      };
      dispatch(putIncome(updatedIncome));
      handleDialogClose();
    }
  };

  const handleDelete = () => {
    dispatch(deleteIncome(get(income, '_id')));
    handleDialogClose();
  };

  const validate = () => {
    if (
      isNaN(values.amount) ||
      values.type.length === 0 ||
      !values.source ||
      values.source.length === 0 ||
      !values.date ||
      values.deductions.length === 0
    )
      return false;
    else return true;
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

  const incomeDiff = () => {
    if (
      values.amount === get(income, 'amount') &&
      values.source === get(income, 'source') &&
      values.type === get(income, 'type') &&
      values.description === get(income, 'description') &&
      dayjs(values.date).format('MM-DD-YYYY') === get(income, 'date') &&
      values.deductions === get(income, 'deductions')
    ) {
      return false;
    } else {
      return true;
    }
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
        {renderDeductions()}
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
              disabled={!validate() || !incomeDiff()}
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
