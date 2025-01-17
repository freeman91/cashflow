import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import useMerchants from '../../store/hooks/useMerchants';
import SelectOption from '../Selector/SelectOption';
import PaymentFromSelect from '../Selector/PaymentFromSelect';
import AutocompleteListItem from './AutocompleteListItem';
import DecimalFieldListItem from './DecimalFieldListItem';

export default function ExpenseListItems(props) {
  const { recurring, setRecurring } = props;

  const merchants = useMerchants();
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
      <DecimalFieldListItem
        id='amount'
        value={recurring?.expense_attributes?.amount}
        onChange={(value) => handleChange('amount', value)}
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
        onChange={(value) => handleChange('category', value)}
        options={categories?.map((category) => category.name)}
      />
      <SelectOption
        id='subcategory'
        label='Subcategory'
        value={recurring?.expense_attributes?.subcategory || ''}
        onChange={(value) => handleChange('subcategory', value)}
        options={subcategories}
      />
      <ListItem disableGutters>
        <PaymentFromSelect
          accountId={recurring?.expense_attributes?.payment_from_id}
          onChange={(value) => handleChange('payment_from_id', value)}
        />
      </ListItem>
    </>
  );
}
