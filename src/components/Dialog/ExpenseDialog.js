import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { deleteExpense, postExpense, putExpense } from '../../store/expenses';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
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

function ExpenseDialog() {
  const dispatch = useDispatch();

  const optionLists = useSelector((state) => state.optionLists.data);
  const categoriesData = useSelector((state) => state.categories.data);
  const recurrings = useSelector((state) => state.recurrings.data);
  const expenses = useSelector((state) => state.expenses.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.expense);

  const [recurring, setRecurring] = useState({ name: '' });
  const [expense, setExpense] = useState(defaultExpense);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const expenseMerchants = find(optionLists, { option_type: 'merchant' });

  useEffect(() => {
    const _recurring = find(recurrings, { recurring_id: expense.recurring_id });
    if (_recurring) {
      setRecurring(_recurring);
    } else {
      setRecurring({ name: '' });
    }
  }, [expense.recurring_id, recurrings]);

  useEffect(() => {
    setExpenseCategories(
      find(categoriesData, {
        category_type: 'expense',
      })
    );
  }, [categoriesData]);

  useEffect(() => {
    setCategories(
      map(expenseCategories?.categories, (category) => {
        return category.name;
      })
    );
  }, [expenseCategories]);

  useEffect(() => {
    let _category = find(expenseCategories?.categories, {
      name: expense.category,
    });

    setSubcategories(get(_category, 'subcategories', []));
  }, [expense.category, expenseCategories]);

  useEffect(() => {
    if (id) {
      let _expense = find(expenses, { expense_id: id });
      setExpense({
        ..._expense,
        date: dayjs(_expense.date),
      });
    }
  }, [id, expenses]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setExpense((e) => ({ ...e, ...attrs, date: dayjs(attrs.date) }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setExpense((prevExpense) => ({
      ...prevExpense,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postExpense(expense));
    } else dispatch(putExpense(expense));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteExpense(expense.expense_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('expense'));
    setExpense(defaultExpense);
    setSubcategories([]);
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultExpense._type}
      title={`${mode} ${defaultExpense._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
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
              onChange={(value) => {
                setExpense({
                  ...expense,
                  date: value.hour(12).minute(0).second(0),
                });
              }}
              slotProps={{
                textField: {
                  variant: 'standard',
                  fullWidth: true,
                },
              }}
            />
          </ListItem>
          <ListItem disableGutters>
            <PaymentFromSelect resource={expense} setResource={setExpense} />
          </ListItem>
          <DecimalFieldListItem
            id='amount'
            item={expense}
            setItem={setExpense}
          />
          <AutocompleteListItem
            id='merchant'
            label='merchant'
            value={expense.merchant}
            options={get(expenseMerchants, 'options', [])}
            onChange={handleChange}
          />
          <SelectOption
            id='category'
            label='category'
            value={expense.category}
            options={categories}
            onChange={handleChange}
          />
          <SelectOption
            id='subcategory'
            label='subcategory'
            value={expense.subcategory}
            options={subcategories}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='description'
            label='description'
            value={expense.description || ''}
            onChange={handleChange}
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
              onClick={() =>
                setExpense({ ...expense, pending: !expense.pending })
              }
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={!expense.pending}
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText
                primary={expense.pending ? 'pending' : 'processed'}
              />
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
        </List>
      </form>
    </BaseDialog>
  );
}

export default ExpenseDialog;
