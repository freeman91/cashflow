import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import AutocompleteListItem from '../../../components/List/AutocompleteListItem';
import DecimalFieldListItem from '../../../components/List/DecimalFieldListItem';
import DepositToSelect from '../../../components/Selector/DepositToSelect';
import ContributionListItem from '../../../components/List/ContributionListItem';

export default function PaycheckListItems(props) {
  const { recurring, setRecurring } = props;

  const handleChange = (key, value) => {
    setRecurring((prevRecurring) => ({
      ...prevRecurring,
      expense_attributes: { ...prevRecurring.expense_attributes, [key]: value },
    }));
  };

  return (
    <>
      <ListItemText
        primary='Paycheck Attributes'
        slotProps={{ primary: { align: 'center' } }}
      />
      <AutocompleteListItem
        id='employer'
        label='employer'
        value={recurring.paycheck_attributes.employer}
        options={[recurring.paycheck_attributes.employer]}
        onChange={(e, value) => handleChange('employer', value || '')}
      />
      <DecimalFieldListItem
        id='take_home'
        value={recurring?.paycheck_attributes?.take_home}
        onChange={(value) => handleChange('take_home', value)}
      />
      <DecimalFieldListItem
        id='taxes'
        value={recurring?.paycheck_attributes?.taxes}
        onChange={(value) => handleChange('taxes', value)}
      />
      <ContributionListItem
        label='Retirement Contribution'
        attributes={recurring?.paycheck_attributes?.retirement_contribution}
        onChange={(id, value) =>
          setRecurring((prevRecurring) => ({
            ...prevRecurring,
            paycheck_attributes: {
              ...prevRecurring.paycheck_attributes,
              retirement_contribution: {
                ...prevRecurring.paycheck_attributes.retirement_contribution,
                [id]: value,
              },
            },
          }))
        }
      />
      <ContributionListItem
        label='Benefits Contribution'
        attributes={recurring?.paycheck_attributes?.benefits_contribution}
        onChange={(id, value) =>
          setRecurring((prevRecurring) => ({
            ...prevRecurring,
            paycheck_attributes: {
              ...prevRecurring.paycheck_attributes,
              benefits_contribution: {
                ...prevRecurring.paycheck_attributes.benefits_contribution,
                [id]: value,
              },
            },
          }))
        }
      />
      <DecimalFieldListItem
        id='other_benefits'
        value={recurring?.paycheck_attributes?.other_benefits}
        onChange={(value) => handleChange('other_benefits', value)}
      />
      <DecimalFieldListItem
        id='other'
        value={recurring?.paycheck_attributes?.other}
        onChange={(value) => handleChange('other', value)}
      />
      <ListItem disableGutters>
        <DepositToSelect
          accountId={recurring?.paycheck_attributes?.deposit_to_id}
          onChange={(value) => handleChange('deposit_to_id', value)}
        />
      </ListItem>
    </>
  );
}
