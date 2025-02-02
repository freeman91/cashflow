import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { postExpense, putExpense } from '../../store/expenses';
import { closeItemView } from '../../store/itemView';
import useMerchants from '../../store/hooks/useMerchants';
import AutocompleteListItem from '../List/AutocompleteListItem';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import PaymentFromSelect from '../Selector/PaymentFromSelect';
import SelectOption from '../Selector/SelectOption';

const defaultExpense = {
  expense_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  merchant: '',
  _type: 'expense',
  category: '',
  subcategory: '',
  pending: false,
  recurring_id: '',
  payment_from_id: '',
  description: '',
};

function ExpenseForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();

  const merchants = useMerchants();
  const recurrings = useSelector((state) => state.recurrings.data);
  const expenses = useSelector((state) => state.expenses.data);
  const categories = useSelector((state) => {
    const categories = find(state.categories.data, {
      category_type: 'expense',
    });
    return categories?.categories;
  });

  const [recurring, setRecurring] = useState({ name: '' });
  const [expense, setExpense] = useState(defaultExpense);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const _recurring = find(recurrings, { recurring_id: expense.recurring_id });
    if (_recurring) {
      setRecurring(_recurring);
    } else {
      setRecurring({ name: '' });
    }
    return () => {
      setRecurring({ name: '' });
    };
  }, [expense.recurring_id, recurrings]);

  useEffect(() => {
    const _subcategories = find(categories, {
      name: expense?.category,
    });
    setSubcategories(_subcategories?.subcategories || []);
  }, [categories, expense?.category]);

  useEffect(() => {
    if (attrs.expense_id) {
      let _expense = find(expenses, { expense_id: attrs.expense_id });
      setExpense({
        ..._expense,
        date: dayjs(_expense.date),
      });
    } else {
      setExpense((e) => ({
        ...e,
        date: dayjs().hour(12).minute(0).second(0),
        ...attrs,
      }));
    }
    return () => {
      setExpense(defaultExpense);
    };
  }, [attrs, expenses]);

  const handleChange = (id, value) => {
    setExpense((prevExpense) => ({
      ...prevExpense,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postExpense(expense));
    } else dispatch(putExpense(expense));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  return (
    <>
      {recurring.name && (
        <TextFieldListItem
          label='recurring'
          value={recurring.name}
          InputProps={{ readOnly: true }}
        />
      )}
      <ListItem disableGutters>
        <DatePicker
          label='date'
          value={expense.date}
          onChange={(value) =>
            handleChange('date', value.hour(12).minute(0).second(0))
          }
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
            },
          }}
        />
      </ListItem>
      <ListItem disableGutters>
        <PaymentFromSelect
          accountId={expense.payment_from_id}
          onChange={(value) => handleChange('payment_from_id', value)}
        />
      </ListItem>
      <DecimalFieldListItem
        id='amount'
        value={expense.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      <AutocompleteListItem
        id='merchant'
        label='merchant'
        value={expense.merchant}
        options={merchants}
        onChange={(e, value) => {
          handleChange('merchant', value || '');
        }}
      />
      <SelectOption
        id='category'
        label='category'
        value={expense.category}
        options={categories?.map((category) => category.name)}
        onChange={(value) => handleChange('category', value)}
      />
      <SelectOption
        id='subcategory'
        label='subcategory'
        value={expense.subcategory}
        options={subcategories}
        onChange={(value) => handleChange('subcategory', value)}
      />
      <TextFieldListItem
        id='description'
        label='description'
        value={expense.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <DescriptionIcon />
            </InputAdornment>
          ),
        }}
      />
      <ListItem key='pending' disableGutters disablePadding>
        <ListItemButton
          role={undefined}
          onClick={() => handleChange('pending', !expense.pending)}
          dense
        >
          <ListItemIcon>
            <Checkbox edge='start' checked={!expense.pending} tabIndex={-1} />
          </ListItemIcon>
          <ListItemText primary={expense.pending ? 'pending' : 'processed'} />
        </ListItemButton>
      </ListItem>
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

export default ExpenseForm;
