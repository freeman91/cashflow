import React from 'react';

import ListItemText from '@mui/material/ListItemText';

import useIncomeSources from '../../store/hooks/useIncomeSources';
import { INCOME_CATEGORIES } from '../Forms/IncomeForm';
import SelectOption from '../Selector/SelectOption';
import AutocompleteListItem from './AutocompleteListItem';
import DecimalFieldListItem from './DecimalFieldListItem';
import DepositToSelect from '../Selector/DepositToSelect';

export default function IncomeListItems(props) {
  const { recurring, setRecurring } = props;
  const sources = useIncomeSources();

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
        options={INCOME_CATEGORIES}
      />
      <DepositToSelect
        accountId={recurring?.income_attributes?.deposit_to_id}
        onChange={(value) => handleChange('deposit_to_id', value)}
      />
    </>
  );
}
