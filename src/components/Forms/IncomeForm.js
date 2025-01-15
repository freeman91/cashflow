import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { closeItemView } from '../../store/itemView';
import { postIncome, putIncome } from '../../store/incomes';
import useIncomeSources from '../../store/hooks/useIncomeSources';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import AutocompleteListItem from '../List/AutocompleteListItem';
import DepositToSelect from '../Selector/DepositToSelect';
import SelectOption from '../Selector/SelectOption';

export const INCOME_CATEGORIES = [
  'credit card reward',
  'dividend',
  'gift',
  'interest',
  'inheritance',
  'other',
  'refund',
  'rental',
  'royalties',
  'sale',
  'tax refund',
  'tips',
];

const defaultIncome = {
  income_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  source: '',
  _type: 'income',
  category: '',
  description: '',
};

function IncomeForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();
  const sources = useIncomeSources();
  const incomes = useSelector((state) => state.incomes.data);

  const [income, setIncome] = useState(defaultIncome);

  useEffect(() => {
    if (attrs?.income_id) {
      let _income = find(incomes, { income_id: attrs.income_id });
      setIncome({
        ..._income,
        date: dayjs(_income.date),
      });
    } else {
      setIncome((i) => ({ ...i, ...attrs }));
    }
    return () => {
      setIncome(defaultIncome);
    };
  }, [attrs, incomes]);

  const handleChange = (id, value) => {
    setIncome((prevIncome) => ({
      ...prevIncome,
      [id]: value,
    }));
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postIncome(income));
    } else dispatch(putIncome(income));
    handleClose();
  };

  return (
    <>
      <ListItem disableGutters>
        <DepositToSelect
          accountId={income.deposit_to_id}
          onChange={(value) => handleChange('deposit_to_id', value)}
        />
      </ListItem>
      <ListItem disableGutters>
        <DatePicker
          label='date'
          value={income.date}
          onChange={(value) => {
            handleChange('date', value.hour(12).minute(0).second(0));
          }}
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
            },
          }}
        />
      </ListItem>
      <DecimalFieldListItem
        id='amount'
        value={income.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      <AutocompleteListItem
        id='source'
        label='source'
        value={income.source}
        options={sources}
        onChange={(e, value) => {
          handleChange('source', value || '');
        }}
      />
      <SelectOption
        id='category'
        label='category'
        value={income.category}
        options={INCOME_CATEGORIES}
        onChange={(value) => handleChange('category', value)}
      />
      <TextFieldListItem
        id='description'
        label='description'
        value={income.description}
        onChange={(e) => handleChange('description', e.target.value)}
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
          onClick={() => handleChange('pending', !income.pending)}
          dense
        >
          <ListItemIcon>
            <Checkbox edge='start' checked={!income.pending} tabIndex={-1} />
          </ListItemIcon>
          <ListItemText primary={income.pending ? 'pending' : 'processed'} />
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
    </>
  );
}

export default IncomeForm;
