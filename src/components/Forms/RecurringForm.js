import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { closeItemView } from '../../store/itemView';
import { postRecurring, putRecurring } from '../../store/recurrings';
import SelectOption from '../Selector/SelectOption';
import ExpenseListItems from '../List/ExpenseListItems';
import RepaymentListItems from '../List/RepaymentListItems';
import PaycheckListItems from '../List/PaycheckListItems';
import IncomeListItems from '../List/IncomeListItems';
import IntegerFieldListItem from '../List/IntegerFieldListItem';

const defaultRecurring = {
  _type: 'recurring',
  recurring_id: '',
  next_date: dayjs().hour(12).minute(0).second(0),
  name: '',
  frequency: '',
  interval: '',
  day_of_week: '',
  day_of_month: '',
  month_of_year: '',
  item_type: '',
  active: true,
  description: '',
};

function RecurringForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();

  const recurrings = useSelector((state) => state.recurrings.data);
  const [recurring, setRecurring] = useState({});

  useEffect(() => {
    if (attrs?.recurring_id) {
      let _recurring = find(recurrings, { recurring_id: attrs.recurring_id });
      setRecurring({
        ..._recurring,
        date: dayjs(_recurring.date),
      });
    } else {
      setRecurring((e) => ({ ...e, ...attrs }));
    }
    return () => {
      setRecurring(defaultRecurring);
    };
  }, [attrs, recurrings]);

  const handleChange = (key, value) => {
    setRecurring({ ...recurring, [key]: value });
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      dispatch(postRecurring(recurring));
    } else {
      dispatch(putRecurring(recurring));
    }
    handleClose();
  };

  return (
    <>
      <TextFieldListItem
        id='name'
        label='Name'
        value={recurring?.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      {mode === 'create' && (
        <SelectOption
          id='item_type'
          label='Item Type'
          value={recurring?.item_type || ''}
          options={['expense', 'repayment', 'paycheck', 'income']}
          onChange={(value) => handleChange('item_type', value)}
        />
      )}

      <ListItem disableGutters>
        <FormControl fullWidth>
          <InputLabel>Frequency</InputLabel>
          <Select
            variant='standard'
            fullWidth
            value={recurring?.frequency || ''}
            onChange={(e) => {
              handleChange('frequency', e.target.value);
            }}
            displayEmpty
            MenuProps={{
              MenuListProps: {
                disablePadding: true,
                sx: {
                  '& .MuiPaper-root': { minWidth: 'unset' },
                },
              },
              slotProps: {
                paper: {
                  sx: {
                    minWidth: 'unset !important',
                  },
                },
              },
            }}
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {['weekly', 'monthly', 'yearly'].map((day) => (
              <MenuItem key={day} value={day}>
                <ListItemText primary={day} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ListItem>
      <IntegerFieldListItem
        id='interval'
        label='Interval'
        item={recurring}
        setItem={setRecurring}
        startAdornment={null}
      />
      <IntegerFieldListItem
        id='day_of_week'
        label='Day of Week'
        item={recurring}
        setItem={setRecurring}
        startAdornment={null}
      />
      <IntegerFieldListItem
        id='day_of_month'
        label='Day of Month'
        item={recurring}
        setItem={setRecurring}
        startAdornment={null}
      />
      <IntegerFieldListItem
        id='month_of_year'
        label='Month of Year'
        item={recurring}
        setItem={setRecurring}
        startAdornment={null}
      />
      <ListItem disableGutters>
        <DatePicker
          label='Next Date'
          slotProps={{
            textField: { variant: 'standard', fullWidth: true },
            field: {
              clearable: true,
              onClear: () =>
                setRecurring((prev) => ({
                  ...prev,
                  next_date: null,
                })),
            },
          }}
          value={dayjs(recurring?.next_date)}
          onChange={(newValue) => handleChange('next_date', newValue)}
        />
      </ListItem>
      {/* <Divider sx={{ my: 1 }} /> */}
      {recurring?.item_type === 'expense' && (
        <ExpenseListItems recurring={recurring} setRecurring={setRecurring} />
      )}
      {recurring?.item_type === 'repayment' && (
        <RepaymentListItems
          mode={mode}
          recurring={recurring}
          setRecurring={setRecurring}
        />
      )}
      {recurring?.item_type === 'paycheck' && (
        <PaycheckListItems
          mode={mode}
          recurring={recurring}
          setRecurring={setRecurring}
        />
      )}
      {recurring?.item_type === 'income' && (
        <IncomeListItems
          mode={mode}
          recurring={recurring}
          setRecurring={setRecurring}
        />
      )}
      <ListItem
        key='buttons'
        disableGutters
        sx={{ justifyContent: 'space-around' }}
      >
        <Button
          onClick={handleClose}
          variant='outlined'
          color='info'
          sx={{ width: '45%' }}
        >
          cancel
        </Button>
        <Button
          type='submit'
          id='submit'
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          sx={{ width: '45%' }}
        >
          submit
        </Button>
      </ListItem>
    </>
  );
}

export default RecurringForm;
