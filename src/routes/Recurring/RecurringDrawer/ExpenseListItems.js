import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemText from '@mui/material/ListItemText';

import SelectOption from '../../../components/Selector/SelectOption';
import PaymentFromSelect from '../../../components/Selector/PaymentFromSelect';
import AutocompleteListItem from '../../../components/List/AutocompleteListItem';
import TextFieldListItem from '../../../components/List/TextFieldListItem';

export default function ExpenseListItems(props) {
  const { recurring, setRecurring } = props;

  const merchants = useSelector((state) => {
    const expenseMerchants = find(state.optionLists.data, {
      option_type: 'merchant',
    });
    return expenseMerchants?.options;
  });
  const categories = useSelector((state) => {
    const categories = find(state.categories.data, {
      category_type: 'expense',
    });
    return categories?.categories;
  });

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const _subcategories = find(categories, {
      name: recurring?.expense_attributes?.category,
    });
    setSubcategories(_subcategories?.subcategories || []);
  }, [categories, recurring?.expense_attributes?.category]);

  const handleChange = (key, value) => {
    console.log('key: ', key, 'value: ', value);
    setRecurring((prevRecurring) => ({
      ...prevRecurring,
      expense_attributes: { ...prevRecurring.expense_attributes, [key]: value },
    }));
  };

  return (
    <>
      <ListItemText
        primary='Expense Attributes'
        slotProps={{ primary: { align: 'center' } }}
      />
      <TextFieldListItem
        id='amount'
        label='amount'
        placeholder='0.00'
        value={recurring?.expense_attributes?.amount || ''}
        onChange={handleChange}
        inputProps={{ inputMode: 'decimal' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <AttachMoneyIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={() => handleChange('amount', '')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <AutocompleteListItem
        id='merchant'
        label='merchant'
        value={recurring?.expense_attributes?.merchant || ''}
        options={merchants}
        onChange={handleChange}
      />
      <SelectOption
        id='category'
        label='Category'
        value={recurring?.expense_attributes?.category || ''}
        onChange={(e) => handleChange('category', e.target.value)}
        options={categories.map((category) => category.name)}
      />
      <SelectOption
        id='subcategory'
        label='Subcategory'
        value={recurring?.expense_attributes?.subcategory || ''}
        onChange={(e) => handleChange('subcategory', e.target.value)}
        options={subcategories}
      />
      <PaymentFromSelect
        accountId={recurring?.expense_attributes?.payment_from_id}
        onChange={(value) => handleChange('payment_from_id', value)}
      />
    </>
  );
}
