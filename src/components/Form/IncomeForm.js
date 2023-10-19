import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { get } from 'lodash';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Button,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';

import { postIncome, putIncome, deleteIncome } from '../../store/incomes';
import { TextFieldListItem } from '../List/TextFieldListItem';
import { AutocompleteListItem } from '../List/AutocompleteListItem';

function TextFieldSubListItem(props) {
  return (
    <TextField
      variant='standard'
      placeholder='0'
      sx={{
        width: '45%',
        margin: '.5rem',
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <AttachMoneyIcon />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

const defaultState = {
  amount: '',
  deductions: {},
  type: '',
  source: '',
  description: '',
  date: dayjs(),
};

export default function IncomeForm({ mode, income, date, handleClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(defaultState);
  const [initialDeductions] = useState({
    '401k': '',
    benefits: '',
    tax: '',
    other: '',
  });

  useEffect(() => {
    let _deductions = get(income, 'deductions', {});
    if (Object.keys(_deductions).length === 0) {
      _deductions = initialDeductions;
    }

    if (mode === 'create') {
      setValues({
        ...values,
        deductions: _deductions,
        date: date ? date : dayjs(),
      });
    } else if (mode === 'update') {
      setValues({
        amount: get(income, 'amount', 0),
        source: get(income, 'source', ''),
        type: get(income, 'type', ''),
        deductions: _deductions,
        description: get(income, 'description', ''),
        date: dayjs(get(income, 'date', '')),
      });
    }
    // eslint-disable-next-line
  }, [mode, income, initialDeductions]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();

    let _values = values;
    if (values.type !== 'paycheck') {
      _values.deductions = {
        '401k': 0,
        benefits: 0,
        tax: 0,
        other: 0,
      };
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
      handleClose();
    }
  };

  const handleUpdate = () => {
    let _values = values;
    if (values.type !== 'paycheck') {
      _values.deductions = initialDeductions;
    }

    let updatedIncome = {
      ...income,
      ..._values,
      date: dayjs(_values.date).format('MM-DD-YYYY'),
    };
    dispatch(putIncome(updatedIncome));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteIncome(get(income, 'id')));
    handleClose();
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      handleCreate();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleClose();
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
        <ListItem>
          <ListItemText
            primary='Deductions'
            primaryTypographyProps={{ align: 'center' }}
          />
        </ListItem>
        <ListItem>
          <TextFieldSubListItem
            id='401k'
            label='401k'
            value={values.deductions['401k']}
            onChange={(e) =>
              setValues({
                ...values,
                deductions: {
                  ...values.deductions,
                  '401k': e.target.value,
                },
              })
            }
          />
          <TextFieldSubListItem
            id='benefits'
            label='benefits'
            value={values.deductions.benefits}
            onChange={(e) =>
              setValues({
                ...values,
                deductions: {
                  ...values.deductions,
                  benefits: e.target.value,
                },
              })
            }
          />
        </ListItem>
        <ListItem>
          <TextFieldSubListItem
            id='tax'
            label='tax'
            value={values.deductions.tax}
            onChange={(e) =>
              setValues({
                ...values,
                deductions: {
                  ...values.deductions,
                  tax: e.target.value,
                },
              })
            }
          />
          <TextFieldSubListItem
            id='other'
            label='other'
            value={values.deductions.other}
            onChange={(e) =>
              setValues({
                ...values,
                deductions: {
                  ...values.deductions,
                  other: e.target.value,
                },
              })
            }
          />
        </ListItem>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <List>
        <TextFieldListItem
          id='amount'
          label='amount'
          placeholder='0'
          value={values.amount}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        <AutocompleteListItem
          id='type'
          label='type'
          value={values.type}
          options={user.income_types}
          onChange={(e, value) => {
            setValues({ ...values, type: value ? value : '' });
          }}
        />
        <AutocompleteListItem
          id='source'
          label='source'
          value={values.source}
          options={user.income_sources}
          onChange={(e, value) => {
            setValues({ ...values, source: value ? value : '' });
          }}
        />
        {renderDeductions()}
        <TextFieldListItem
          id='description'
          label='description'
          value={values.description}
          onChange={handleChange}
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
            label='date'
            value={values.date}
            onChange={(value) => {
              setValues({ ...values, date: value });
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant='standard' />
            )}
          />
        </ListItem>
        <ListItem>
          <Stack
            direction='row'
            spacing={2}
            sx={{ width: '100%' }}
            justifyContent='flex-end'
          >
            <Button
              id='cancel'
              variant='outlined'
              color='secondary'
              onClick={handleClose}
            >
              Cancel
            </Button>
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
                  id='delete'
                  variant='contained'
                  onClick={handleDelete}
                  color='error'
                >
                  Delete
                </Button>
                <Button
                  type='submit'
                  id='update'
                  disabled={!incomeDiff()}
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
