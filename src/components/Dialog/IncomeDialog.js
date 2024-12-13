import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { deleteIncome, postIncome, putIncome } from '../../store/incomes';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import AutocompleteListItem from '../List/AutocompleteListItem';
import DepositToSelect from '../Selector/DepositToSelect';
import SelectOption from '../Selector/SelectOption';

const defaultIncome = {
  income_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  source: '',
  _type: 'income',
  category: '',
  description: '',
};

function IncomeDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const incomes = useSelector((state) => state.incomes.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.income);
  const [income, setIncome] = useState(defaultIncome);

  const incomeSources = find(optionLists, { option_type: 'income_source' });
  const incomeCategories = find(
    optionLists,
    {
      option_type: 'income_category',
    },
    []
  );

  useEffect(() => {
    if (id) {
      let _income = find(incomes, { income_id: id });
      setIncome({
        ..._income,
        date: dayjs(_income.date),
      });
    }
  }, [id, incomes]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setIncome((prevIncome) => ({
        ...prevIncome,
        ...attrs,
        date: dayjs(attrs.date),
      }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setIncome((prevIncome) => ({
      ...prevIncome,
      [e.target.id]: e.target.value,
    }));
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

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultIncome._type}
      title={`${mode} ${defaultIncome._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          <ListItem disableGutters>
            <DepositToSelect resource={income} setResource={setIncome} />
          </ListItem>
          <ListItem disableGutters>
            <DatePicker
              label='date'
              value={income.date}
              onChange={(value) => {
                setIncome({
                  ...income,
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
          <DecimalFieldListItem id='amount' item={income} setItem={setIncome} />
          <AutocompleteListItem
            id='source'
            label='source'
            value={income.source}
            options={get(incomeSources, 'options', [])}
            onChange={handleChange}
          />
          <SelectOption
            id='category'
            label='category'
            value={income.category}
            options={get(incomeCategories, 'options', [])}
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

export default IncomeDialog;
