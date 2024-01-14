import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';

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
import TextField from '@mui/material/TextField';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  deleteRepayment,
  postRepayment,
  putRepayment,
} from '../../store/repayments';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import DebtSelect from '../Selector/DebtSelect';
import { _numberToCurrency } from '../../helpers/currency';

const defaultRepayment = {
  repayment_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  principal: '',
  interest: '',
  escrow: '',
  lender: '',
  _type: 'repayment',
  pending: false,
  debt_id: '',
  bill_id: '',
};

function RepaymentDialog() {
  const dispatch = useDispatch();
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const debts = useSelector((state) => state.debts.data);
  const repayments = useSelector((state) => state.repayments.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.repayment);

  const [repayment, setRepayment] = useState(defaultRepayment);
  const [debt, setDebt] = useState({ name: '' });

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
      setRepayment(_repayment);
    }
  }, [id, repayments]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setRepayment((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setRepayment({ ...repayment, [e.target.id]: e.target.value });
  };

  const handleChangeNumber = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setRepayment({ ...repayment, [e.target.id]: e.target.value });
    }
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

    if (!Number(repayment.escrow).isNaN) {
      _total += Number(repayment.escrow);
    }

    return _total;
  })();

  return (
    <BaseDialog
      type={defaultRepayment._type}
      title={`${mode} ${defaultRepayment._type}`}
      handleClose={handleClose}
      titleOptions={<MenuItem onClick={handleDelete}>delete</MenuItem>}
    >
      <form>
        <List sx={{ width: 375 }}>
          {mode !== 'create' && (
            <TextFieldListItem
              id='repayment_id'
              label='repayment_id'
              value={repayment.repayment_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )}
          <DebtSelect resource={repayment} setResource={setRepayment} />
          <ListItem sx={{ pl: 0, pr: 0 }}>
            <DatePicker
              label='date'
              value={repayment.date}
              onChange={(value) => {
                setRepayment({
                  ...repayment,
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
            value={_numberToCurrency.format(total)}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextFieldListItem
            id='principal'
            label='principal'
            placeholder='0.00'
            value={repayment.principal}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextFieldListItem
            id='interest'
            label='interest'
            placeholder='0.00'
            value={repayment.interest}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          {debt?.name === 'Mortgage' && (
            <TextFieldListItem
              id='escrow'
              label='escrow'
              placeholder='0.00'
              value={repayment.escrow}
              onChange={handleChangeNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
          <TextFieldListItem
            id='lender'
            label='lender'
            value={repayment.lender}
            onChange={handleChange}
          />
          <ListItem key='pending' disablePadding sx={{ pl: 0, pr: 0 }}>
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

export default RepaymentDialog;
