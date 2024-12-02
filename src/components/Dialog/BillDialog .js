import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import range from 'lodash/range';

import AutocompleteListItem from '../List/AutocompleteListItem';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextFieldListItem from '../List/TextFieldListItem';

import { deleteBill, postBill, putBill } from '../../store/bills';
import { closeDialog, openDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import DebtSelect from '../Selector/DebtSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import PaymentFromSelect from '../Selector/PaymentFromSelect';
import SelectOption from '../Selector/SelectOption';

const defaultBill = {
  bill_id: '',
  name: '',
  amount: '',
  category: '',
  subcategory: '',
  vendor: '',
  _type: 'bill',
  day: '15',
  months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  debt_id: '',
};

function BillDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const categoriesData = useSelector((state) => state.categories.data);
  const accounts = useSelector((state) => state.accounts.data);
  const debts = useSelector((state) => state.debts.data);
  const bills = useSelector((state) => state.bills.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.bill);
  const [bill, setBill] = useState(defaultBill);

  const expenseVendors = find(optionLists, { option_type: 'expense_vendor' });
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

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
      name: bill.category,
    });

    setSubcategories(get(_category, 'subcategories', []));
  }, [bill.category, expenseCategories]);

  useEffect(() => {
    if (id) {
      let _bill = find(bills, { bill_id: id });
      setBill(_bill);
    }
  }, [id, bills]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setBill((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  useEffect(() => {
    if (bill.debt_id) {
      const debt = find(debts, { debt_id: bill.debt_id });
      const account = find(accounts, { account_id: debt.account_id });
      setBill((bill) => ({
        ...bill,
        name: debt.name,
        vendor: account.name,
      }));
    }
  }, [bill.debt_id, accounts, debts]);

  const handleChange = (e) => {
    setBill({ ...bill, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postBill(bill));
    } else dispatch(putBill(bill));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteBill(bill.bill_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('bill'));
    setBill(defaultBill);
  };

  const handleGenerateExpense = () => {
    const type = bill?.debt_id ? 'repayment' : 'expense';
    let attrs = {
      user_id: bill.user_id,
      category: bill.category,
      subcategory: bill.subcategory,
      pending: true,
      date: bill.nextBillDate,
      payment_from_id: bill.payment_from_id,
    };

    if (type === 'repayment') {
      let principal,
        interest,
        escrow = null;
      const debt = find(debts, { debt_id: bill.debt_id });

      interest = parseFloat(
        (debt.amount * (debt.interest_rate / 12)).toFixed(2)
      );
      principal = parseFloat((bill.amount - interest).toFixed(2));

      if (bill?.escrow) {
        escrow = bill.escrow;
        principal -= escrow;
        principal = parseFloat(principal.toFixed(2));
      }

      attrs = {
        ...attrs,
        principal,
        interest,
        escrow,
        lender: bill.vendor,
        debt_id: bill.debt_id,
        bill_id: bill.bill_id,
      };
    } else {
      attrs = {
        ...attrs,
        amount: bill.amount,
        vendor: bill.vendor,
        bill_id: bill.bill_id,
      };
    }

    dispatch(
      openDialog({
        type,
        mode: 'create',
        attrs,
      })
    );
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='generate' onClick={handleGenerateExpense}>
        generate expense
      </MenuItem>
    ),
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultBill._type}
      title={`${mode} ${defaultBill._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='bill_id'
              label='bill_id'
              value={bill.bill_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          {(mode === 'create' || bill.debt_id) && (
            <ListItem key='debt-select' disablePadding sx={{ pt: 2, pb: 1 }}>
              <DebtSelect mode={mode} resource={bill} setResource={setBill} />
            </ListItem>
          )}
          <PaymentFromSelect resource={bill} setResource={setBill} />
          <TextFieldListItem
            id='name'
            label='name'
            value={bill.name}
            onChange={handleChange}
          />
          <DecimalFieldListItem id='amount' item={bill} setItem={setBill} />
          {bill.subcategory === 'mortgage' && (
            <DecimalFieldListItem
              id='escrow'
              item={bill}
              setItem={setBill}
              label='escrow'
            />
          )}
          <AutocompleteListItem
            id='vendor'
            label='vendor'
            value={bill.vendor}
            options={get(expenseVendors, 'options', [])}
            onChange={handleChange}
          />
          <SelectOption
            id='category'
            label='category'
            value={bill.category}
            options={categories}
            onChange={handleChange}
          />
          <SelectOption
            id='subcategory'
            label='subcategory'
            value={bill.subcategory}
            options={subcategories}
            onChange={handleChange}
          />
          <ListItem key='day' disablePadding sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id='day-of-month-label'>day of month</InputLabel>
              <Select
                labelId='day-of-month-label'
                variant='standard'
                fullWidth
                value={bill?.day}
                onChange={(e) => {
                  setBill({ ...bill, day: e.target.value });
                }}
              >
                {range(1, 29).map((day) => (
                  <MenuItem key={day} value={day}>
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem key='months' disablePadding sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id='months-label'>months</InputLabel>
              <Select
                multiple
                labelId='months-label'
                variant='standard'
                fullWidth
                value={bill.months}
                renderValue={(selected) => {
                  if (selected.length === 12) {
                    return 'all';
                  } else {
                    return selected.reduce((acc, curr, idx) => {
                      const month = dayjs()
                        .month(Number(curr) - 1)
                        .format('MMMM');
                      return (
                        acc + month + (idx === selected.length - 1 ? '' : ', ')
                      );
                    }, '');
                  }
                }}
                onChange={(e) => {
                  let months = cloneDeep(bill.months);
                  months = e.target.value;
                  months.sort(function (a, b) {
                    return a - b;
                  });
                  setBill({ ...bill, months });
                }}
              >
                {range(1, 13).map((month) => (
                  <MenuItem key={month} value={month}>
                    <Checkbox checked={bill?.months?.indexOf(month) > -1} />
                    <ListItemText
                      primary={dayjs()
                        .month(Number(month) - 1)
                        .format('MMMM')}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default BillDialog;
