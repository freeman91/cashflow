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
import LiabilitySelect from '../Selector/LiabilitySelect';

export default function RepaymentListItems(props) {
  const { mode, recurring, setRecurring } = props;

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
      name: recurring?.repayment_attributes?.category,
    });
    setSubcategories(_subcategories?.subcategories || []);
  }, [categories, recurring?.repayment_attributes?.category]);

  const handleChange = (key, value) => {
    setRecurring((prevRecurring) => ({
      ...prevRecurring,
      repayment_attributes: {
        ...prevRecurring.repayment_attributes,
        [key]: value,
      },
    }));
  };

  return (
    <>
      <ListItemText
        primary='Repayment Attributes'
        slotProps={{ primary: { align: 'center' } }}
      />
      <DecimalFieldListItem
        id='amount'
        value={recurring?.repayment_attributes?.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      {recurring?.repayment_attributes?.subcategory === 'mortgage' && (
        <DecimalFieldListItem
          id='escrow'
          value={recurring?.repayment_attributes?.escrow}
          onChange={(value) => handleChange('escrow', value)}
        />
      )}
      <AutocompleteListItem
        id='merchant'
        label='merchant'
        value={recurring?.repayment_attributes?.merchant || ''}
        options={merchants}
        onChange={(e, value) => handleChange('merchant', value || '')}
      />
      <SelectOption
        id='category'
        label='Category'
        value={recurring?.repayment_attributes?.category || ''}
        onChange={(value) => handleChange('category', value)}
        options={categories?.map((category) => category.name)}
      />
      <SelectOption
        id='subcategory'
        label='Subcategory'
        value={recurring?.repayment_attributes?.subcategory || ''}
        onChange={(value) => handleChange('subcategory', value)}
        options={subcategories}
      />
      <ListItem disableGutters>
        <LiabilitySelect
          mode={mode}
          accountId={recurring?.repayment_attributes?.account_id}
          setAccountId={(value) => handleChange('account_id', value)}
        />
      </ListItem>
      <ListItem disableGutters>
        <PaymentFromSelect
          accountId={recurring?.repayment_attributes?.payment_from_id}
          onChange={(value) => handleChange('payment_from_id', value)}
        />
      </ListItem>
    </>
  );
}
