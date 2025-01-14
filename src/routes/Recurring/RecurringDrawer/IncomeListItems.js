import React from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';

import ListItemText from '@mui/material/ListItemText';

import SelectOption from '../../../components/Selector/SelectOption';
import AutocompleteListItem from '../../../components/List/AutocompleteListItem';
import DecimalFieldListItem from '../../../components/List/DecimalFieldListItem';
import DepositToSelect from '../../../components/Selector/DepositToSelect';

export default function IncomeListItems(props) {
  const { recurring, setRecurring } = props;

  const { sources, categories } = useSelector((state) => {
    const incomeSources = find(state.optionLists.data, {
      option_type: 'income_source',
    });
    const incomeCategories = find(state.categories.data, {
      category_type: 'income_category',
    });
    return {
      sources: incomeSources?.options,
      categories: incomeCategories?.options,
    };
  });

  const handleChange = (key, value) => {
    setRecurring((prevRecurring) => ({
      ...prevRecurring,
      income_attributes: { ...prevRecurring.income_attributes, [key]: value },
    }));
  };

  return (
    <>
      <ListItemText
        primary='Income Attributes'
        slotProps={{ primary: { align: 'center' } }}
      />
      <DecimalFieldListItem
        id='amount'
        value={recurring?.income_attributes?.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      <AutocompleteListItem
        id='source'
        label='Source'
        value={recurring?.income_attributes?.source || ''}
        options={sources}
        onChange={(e, value) => handleChange('source', value || '')}
      />
      <SelectOption
        id='category'
        label='Category'
        value={recurring?.income_attributes?.category || ''}
        onChange={(value) => handleChange('category', value)}
        options={categories?.map((category) => category.name)}
      />
      <DepositToSelect
        accountId={recurring?.income_attributes?.deposit_to_id}
        onChange={(value) => handleChange('deposit_to_id', value)}
      />
    </>
  );
}
