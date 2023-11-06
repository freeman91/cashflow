import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
import TextField from '@mui/material/TextField';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import BaseDialog from './BaseDialog';
import TextFieldListItem from '../List/TextFieldListItem';
import AutocompleteListItem from '../List/AutocompleteListItem';

const defaultExpense = {
  expense_id: '',
  date: dayjs(),
  amount: '',
  vendor: '',
  category: '',
  pending: false,
  bill_id: '',
  asset_id: '',
  description: '',
};

function ExpenseDialog() {
  // const optionLists = useSelector((state) => state.optionLists.data);
  const { mode } = useSelector((state) => state.dialogs.expense);
  const [expense, setExpense] = useState(defaultExpense);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    console.log('e: ', e);
  };

  const handleDelete = () => {
    console.log('delete');
  };

  return (
    <BaseDialog
      type='expense'
      title={`${mode} expense`}
      titleOptions={<MenuItem onClick={handleDelete}>Delete</MenuItem>}
      actions={
        <Button
          type='submit'
          id='submit'
          variant='contained'
          color='primary'
          onClick={handleSubmit}
        >
          submit
        </Button>
      }
    >
      <form onSubmit={handleSubmit}>
        <List sx={{ width: 300 }}>
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
                setExpense({ ...expense, date: value });
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
            options={[]}
            onChange={handleChange}
          />
          <AutocompleteListItem
            id='category'
            label='category'
            value={expense.category}
            options={[]}
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
              startAdornment: (
                <InputAdornment position='start'>
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
        </List>
      </form>
    </BaseDialog>
  );
}

export default ExpenseDialog;
