import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { find, get, map, transform } from 'lodash';
import { Box, Button, Grid, InputAdornment, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { AttachMoney as AttachMoneyIcon } from '@mui/icons-material';

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

  useEffect(() => {
    let monthGoals = find(goals, {
      year: date.year(),
      month: date.month() + 1,
    });

    if (monthGoals) {
      setValues(
        transform(
          get(monthGoals, 'values'),
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
    console.log('values: ', values);
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
