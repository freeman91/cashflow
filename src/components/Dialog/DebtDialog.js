import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutocompleteListItem from '../List/AutocompleteListItem';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { deleteDebt, postDebt, putDebt } from '../../store/debts';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import AccountSelect from '../Selector/AccountSelect';

const defaultDebt = {
  debt_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  account_id: '',
  _type: 'debt',
  name: '',
  value: '',
  category: '',
  interest_rate: '',
};

function DebtDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const debts = useSelector((state) => state.debts.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.debt);
  const [debt, setDebt] = useState(defaultDebt);

  const debtCategories = find(optionLists, {
    option_type: 'debt_category',
  });

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

  const handleChangeNumber = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setDebt({ ...debt, [e.target.id]: e.target.value });
    }
  };

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
  };

  const handleClose = () => {
    dispatch(closeDialog('debt'));
    setDebt(defaultDebt);
  };

  return (
    <BaseDialog
      type={defaultDebt._type}
      title={`${mode} ${defaultDebt._type}`}
      handleClose={handleClose}
      titleOptions={[
        <MenuItem key='borrow' onClick={() => {}}>
          borrow
        </MenuItem>,
        <MenuItem key='repayment' onClick={() => {}}>
          repayemnt
        </MenuItem>,
        <MenuItem key='delete' onClick={handleDelete}>
          delete
        </MenuItem>,
      ]}
    >
      <form>
        <List sx={{ width: 375 }}>
          {mode !== 'create' && (
            <TextFieldListItem
              id='debt_id'
              label='debt_id'
              value={debt.debt_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )}
          <AccountSelect resource={debt} setResource={setDebt} />
          <TextFieldListItem
            id='name'
            label='name'
            value={debt.name}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='value'
            label='value'
            placeholder='0.00'
            value={debt.value}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />

          <AutocompleteListItem
            id='category'
            label='category'
            value={debt.category}
            options={get(debtCategories, 'options', [])}
            onChange={handleChange}
          />

          <TextFieldListItem
            id='interest_rate'
            label='interest rate'
            placeholder='0.00'
            value={debt.interest_rate}
            onChange={handleChangeNumber}
          />

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

export default DebtDialog;
