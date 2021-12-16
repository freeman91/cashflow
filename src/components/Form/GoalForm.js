import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { find, hasIn, get, map, transform, mapValues } from 'lodash';
import { Box, Button, Grid, InputAdornment, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { AttachMoney as AttachMoneyIcon } from '@mui/icons-material';

import { postGoal, putGoal } from '../../store/goals';

const defaultState = {
  housing: '',
  utilities: '',
  debt: '',
  transportation: '',
  grocery: '',
  dining: '',
  health: '',
  entertainment: '',
  pets: '',
  personal: '',
  home: '',
  fitness: '',
  investments: '',
  other: '',
};

export default function GoalForm() {
  const dispatch = useDispatch();
  const { data: goals } = useSelector((state) => state.goals);
  const [date, setDate] = useState(dayjs().add(1, 'months'));
  const [values, setValues] = useState(defaultState);
  const [monthGoal, setMonthGoal] = useState({});

  useEffect(() => {
    let _monthGoal = find(goals, {
      year: date.year(),
      month: date.month() + 1,
    });

    setMonthGoal(_monthGoal);

    if (_monthGoal) {
      setValues(
        transform(
          get(_monthGoal, 'values'),
          (result, value, key) => {
            result[key.toLowerCase()] = String(value);
          },
          {}
        )
      );
    } else {
      setValues(defaultState);
    }
  }, [date, goals]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let _values = mapValues(values, (value) => {
      return Number(value);
    });

    if (hasIn(monthGoal, 'date')) {
      dispatch(putGoal({ ...monthGoal, values: _values }));
    } else {
      dispatch(
        postGoal({
          values: _values,
          date: date.format('DD-MM-YYYY'),
        })
      );
    }
  };

  const validate = () => {
    for (const value of Object.values(values)) {
      if (isNaN(value)) {
        return false;
      }
    }
    return true;
  };

  const handleClear = () => {
    setValues(defaultState);
  };

  const handleFormEnterClick = () => {
    handleSubmit();
  };

  return (
    <>
      <Grid item xs={12}>
        <DatePicker
          views={['year', 'month']}
          minDate={new Date('2021-11-01')}
          value={date}
          onChange={(newValue) => {
            setDate(dayjs(newValue));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={null}
              fullWidth
              variant='standard'
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <form onSubmit={handleFormEnterClick}>
            {map(defaultState, (_, goal) => {
              return (
                <TextField
                  fullWidth
                  key={`${goal}-text-field`}
                  id={`${goal}-input`}
                  label={goal}
                  name={goal}
                  value={get(values, goal)}
                  variant='outlined'
                  placeholder='0'
                  onChange={(e) =>
                    setValues({ ...values, [goal]: e.target.value })
                  }
                  margin='dense'
                  size='small'
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

            <Button
              id='cancel'
              sx={{ mr: '1rem', mt: '1rem', width: '5rem' }}
              variant='outlined'
              color='info'
              onClick={handleClear}
            >
              Clear
            </Button>
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
          </form>
        </Box>
      </Grid>
    </>
  );
}
