import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import map from 'lodash/map';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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

import { _numberToCurrency } from '../../helpers/currency';
import {
  deleteRepayment,
  postRepayment,
  putRepayment,
} from '../../store/repayments';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import DebtSelect from '../Selector/DebtSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import PaymentFromSelect from '../Selector/PaymentFromSelect';
import SelectOption from '../Selector/SelectOption';

const defaultRepayment = {
  repayment_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  principal: '',
  interest: '',
  escrow: '',
  lender: '',
  category: '',
  subcategory: '',
  _type: 'repayment',
  pending: false,
  debt_id: '',
  bill_id: '',
};

function RepaymentDialog() {
  const dispatch = useDispatch();
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const categoriesData = useSelector((state) => state.categories.data);
  const debts = useSelector((state) => state.debts.data);
  const repayments = useSelector((state) => state.repayments.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.repayment);

  const [expenseCategories, setExpenseCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [repayment, setRepayment] = useState(defaultRepayment);
  const [debt, setDebt] = useState({ name: '' });

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
      name: repayment.category,
    });

    setSubcategories(get(_category, 'subcategories', []));
  }, [repayment.category, expenseCategories]);

  useEffect(() => {
    let _lender = '';
    if (repayment.debt_id) {
      const debt = find(debts, { debt_id: repayment.debt_id });
      const account = find(accounts, { account_id: debt?.account_id });
      setDebt(debt);
      _lender = get(account, 'name', '');
    }
    setRepayment((e) => ({ ...e, lender: _lender }));
  }, [repayment.debt_id, accounts, debts]);

  useEffect(() => {
    if (mode !== 'create') {
      let _pathname = location.pathname;
      if (includes(location.pathname, '/app/debts')) {
        let _id = _pathname.replace('/app/debts', '');
        _id = _id.replace('/', '');
        setRepayment((e) => ({ ...e, debt_id: _id }));
      }
    }
  }, [location.pathname, mode]);

  useEffect(() => {
    if (id) {
      let _repayment = find(repayments, { repayment_id: id });
      setRepayment({
        ..._repayment,
        date: dayjs(_repayment.date),
      });
    }
  }, [id, repayments]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setRepayment((e) => ({ ...e, ...attrs, date: dayjs(attrs.date) }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setRepayment({ ...repayment, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postRepayment(repayment));
    } else dispatch(putRepayment(repayment));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteRepayment(repayment.repayment_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('repayment'));
    setRepayment(defaultRepayment);
    setDebt({ name: '' });
  };

  const total = (() => {
    let _total = 0;

    if (!Number(repayment.principal).isNaN) {
      _total += Number(repayment.principal);
    }

    if (!Number(repayment.interest).isNaN) {
      _total += Number(repayment.interest);
    }

    if (repayment.escrow && !Number(repayment.escrow).isNaN) {
      _total += Number(repayment.escrow);
    }

    return _total;
  })();

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultRepayment._type}
      title={`${mode} ${defaultRepayment._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='repayment_id'
              label='repayment_id'
              value={repayment.repayment_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <ListItem disableGutters>
            <DebtSelect resource={repayment} setResource={setRepayment} />
          </ListItem>
          <ListItem disableGutters>
            <PaymentFromSelect
              resource={repayment}
              setResource={setRepayment}
            />
          </ListItem>
          <ListItem disableGutters>
            <DatePicker
              label='date'
              value={repayment?.date}
              onChange={(value) => {
                setRepayment({
                  ...repayment,
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
          <TextFieldListItem
            id='amount'
            label='amount'
            value={_numberToCurrency.format(total)}
            inputProps={{ inputMode: 'decimal' }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <DecimalFieldListItem
            id='principal'
            item={repayment}
            setItem={setRepayment}
          />
          <DecimalFieldListItem
            id='interest'
            item={repayment}
            setItem={setRepayment}
          />
          {debt?.name.includes('Mortgage') && (
            <DecimalFieldListItem
              id='escrow'
              item={repayment}
              setItem={setRepayment}
            />
          )}
          <TextFieldListItem
            id='lender'
            label='lender'
            value={repayment.lender}
            onChange={handleChange}
          />
          <SelectOption
            id='category'
            label='category'
            value={repayment.category}
            options={categories}
            onChange={handleChange}
          />
          <SelectOption
            id='subcategory'
            label='subcategory'
            value={repayment.subcategory}
            options={subcategories}
            onChange={handleChange}
          />
          <ListItem key='pending' disablePadding disableGutters>
            <ListItemButton
              role={undefined}
              onClick={() =>
                setRepayment({ ...repayment, pending: !repayment.pending })
              }
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={!repayment.pending}
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText primary={repayment.pending ? 'pending' : 'paid'} />
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

export default RepaymentDialog;
