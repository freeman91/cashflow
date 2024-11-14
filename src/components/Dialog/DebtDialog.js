import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import PercentIcon from '@mui/icons-material/Percent';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextFieldListItem from '../List/TextFieldListItem';

import { deleteDebt, postDebt, putDebt } from '../../store/debts';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import AccountSelect from '../Selector/AccountSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import SelectOption from '../Selector/SelectOption';

const defaultDebt = {
  debt_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  account_id: '',
  _type: 'debt',
  name: '',
  amount: '',
  category: '',
  subcategory: '',
  interest_rate: '',
  can_pay_from: false,
};

function DebtDialog() {
  const dispatch = useDispatch();
  const categoriesData = useSelector((state) => state.categories.data);
  const debts = useSelector((state) => state.debts.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.debt);
  const [debt, setDebt] = useState(defaultDebt);

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
      name: debt.category,
    });

    setSubcategories(get(_category, 'subcategories', []));
  }, [debt.category, expenseCategories]);

  useEffect(() => {
    if (id) {
      let _debt = find(debts, { debt_id: id });
      setDebt(_debt);
    }
  }, [id, debts]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setDebt((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setDebt({ ...debt, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      dispatch(postDebt(debt));
    } else dispatch(putDebt(debt));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteDebt(debt.debt_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('debt'));
    setDebt(defaultDebt);
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='borrow' onClick={() => {}}>
        borrow
      </MenuItem>
    ),
    mode === 'edit' && (
      <MenuItem key='repayment' onClick={() => {}}>
        repayment
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
      type={defaultDebt._type}
      title={`${mode} ${defaultDebt._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='debt_id'
              label='debt_id'
              value={debt.debt_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <AccountSelect resource={debt} setResource={setDebt} />
          <TextFieldListItem
            id='name'
            label='name'
            value={debt.name}
            onChange={handleChange}
          />
          <DecimalFieldListItem id='amount' item={debt} setItem={setDebt} />
          <SelectOption
            id='category'
            label='category'
            value={debt.category}
            options={categories}
            onChange={handleChange}
          />
          <SelectOption
            id='subcategory'
            label='subcategory'
            value={debt.subcategory || ''}
            options={subcategories}
            onChange={handleChange}
          />
          <DecimalFieldListItem
            id='interest_rate'
            item={debt}
            setItem={setDebt}
            startAdornment={<PercentIcon />}
          />
          <ListItem disableGutters disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() =>
                setDebt((prevDebt) => ({
                  ...prevDebt,
                  can_pay_from: !prevDebt.can_pay_from,
                }))
              }
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={debt.can_pay_from}
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText primary='can pay from' />
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

export default DebtDialog;
