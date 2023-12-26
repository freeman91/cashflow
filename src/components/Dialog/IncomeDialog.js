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
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { deleteIncome, postIncome, putIncome } from '../../store/incomes';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';

const defaultIncome = {
  income_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  source: '',
  _type: 'income',
  description: '',
};

function IncomeDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const incomes = useSelector((state) => state.incomes.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.income);
  const [income, setIncome] = useState(defaultIncome);

  const incomeSource = find(optionLists, { option_type: 'income_source' });

  useEffect(() => {
    if (id) {
      let _income = find(incomes, { income_id: id });
      setIncome(_income);
    }
  }, [id, incomes]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setIncome((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setIncome({ ...income, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postIncome(income));
    } else dispatch(putIncome(income));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteIncome(income.income_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('income'));
    setIncome(defaultIncome);
  };

  return (
    <BaseDialog
      type={defaultIncome._type}
      title={`${mode} ${defaultIncome._type}`}
      handleClose={handleClose}
      titleOptions={<MenuItem onClick={handleDelete}>delete</MenuItem>}
    >
      <form>
        <List sx={{ width: 375 }}>
          {mode !== 'create' && (
            <TextFieldListItem
              id='income_id'
              label='income_id'
              value={income.income_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )}
          <ListItem sx={{ pl: 0, pr: 0 }}>
            <DatePicker
              label='date'
              value={income.date}
              onChange={(value) => {
                setIncome({
                  ...income,
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
            value={income.amount}
            onChange={(e) => {
              if (
                e.target.value === '' ||
                (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
              ) {
                setIncome({ ...income, amount: e.target.value });
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
            id='source'
            label='source'
            value={income.source}
            options={get(incomeSource, 'options', [])}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='description'
            label='description'
            value={income.description}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
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

export default IncomeDialog;
