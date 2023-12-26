import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AutocompleteListItem from '../List/AutocompleteListItem';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { deleteExpense, postExpense, putExpense } from '../../store/expenses';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';

const defaultExpense = {
  expense_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  vendor: '',
  _type: 'expense',
  category: '',
  pending: false,
  bill_id: '',
  asset_id: '',
  description: '',
};

function ExpenseDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const expenses = useSelector((state) => state.expenses.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.expense);
  const [expense, setExpense] = useState(defaultExpense);

  const expenseVendors = find(optionLists, { option_type: 'expense_vendor' });
  const expenseCategories = find(optionLists, {
    option_type: 'expense_category',
  });

  useEffect(() => {
    if (id) {
      let _expense = find(expenses, { expense_id: id });
      setExpense(_expense);
    }
  }, [id, expenses]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setExpense((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.id]: e.target.value });
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
  };

  return (
    <BaseDialog
      type={defaultExpense._type}
      title={`${mode} ${defaultExpense._type}`}
      handleClose={handleClose}
      titleOptions={<MenuItem onClick={handleDelete}>delete</MenuItem>}
    >
      <form>
        <List sx={{ width: 375 }}>
          {mode !== 'create' && (
            <TextFieldListItem
              id='expense_id'
              label='expense_id'
              value={expense.expense_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )}
          <ListItem sx={{ pl: 0, pr: 0 }}>
            <DatePicker
              label='date'
              value={expense.date}
              onChange={(value) => {
                setExpense({
                  ...expense,
                  date: value.hour(12).minute(0).second(0),
                });
              }}
              renderInput={(params) => {
                return <TextField {...params} fullWidth variant='standard' />;
              }}
            />
          </ListItem>
          <TextFieldListItem
            id='amount'
            label='amount'
            placeholder='0.00'
            value={expense.amount}
            onChange={(e) => {
              if (
                e.target.value === '' ||
                (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
              ) {
                setExpense({ ...expense, amount: e.target.value });
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <AutocompleteListItem
            id='vendor'
            label='vendor'
            value={expense.vendor}
            options={get(expenseVendors, 'options', [])}
            onChange={handleChange}
          />
          <AutocompleteListItem
            id='category'
            label='category'
            value={expense.category}
            options={get(expenseCategories, 'options', [])}
            onChange={handleChange}
          />
          {expense.bill_id && (
            <TextFieldListItem
              id='bill_id'
              label='bill'
              value={expense.bill_id}
            />
          )}
          {expense.asset_id && (
            <TextFieldListItem
              id='asset_id'
              label='asset'
              value={expense.asset_id}
            />
          )}
          <TextFieldListItem
            id='description'
            label='description'
            value={expense.description}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
          />
          <ListItem key='pending' disablePadding sx={{ pl: 0, pr: 0 }}>
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
              <ListItemText primary={expense.pending ? 'Pending' : 'Paid'} />
            </ListItemButton>
          </ListItem>
          <ListItem
            key='buttons'
            disablePadding
            sx={{ pt: 1, pl: 0, pr: 0, justifyContent: 'space-between' }}
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
