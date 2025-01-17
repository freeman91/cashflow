import React from 'react';

import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../../helpers/currency';

export default function PaycheckListItem(props) {
  const { transaction, parentWidth } = props;

  const retirementContributionEe =
    transaction?.retirement_contribution?.employee || 0;
  const retirementContributionEr =
    transaction?.retirement_contribution?.employer || 0;
  const benefitsContributionEe =
    transaction?.benefits_contribution?.employee || 0;
  const benefitsContributionEr =
    transaction?.benefits_contribution?.employer || 0;

  const retirementContribution =
    retirementContributionEe + retirementContributionEr;
  const benefitsContribution = benefitsContributionEe + benefitsContributionEr;

  return (
    <>
      <ListItemText
        primary={transaction.employer}
        sx={{ maxWidth: 250, flex: 1 }}
        slotProps={{
          primary: {
            sx: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
        }}
      />
      <ListItemText
        primary={
          retirementContribution
            ? numberToCurrency.format(retirementContribution)
            : '-'
        }
        sx={{
          maxWidth: 250,
          flex: 1,
          display: parentWidth < 600 ? 'none' : 'block',
        }}
        slotProps={{
          primary: { align: 'left' },
        }}
      />
      <ListItemText
        primary={
          benefitsContribution
            ? numberToCurrency.format(benefitsContribution)
            : '-'
        }
        sx={{
          maxWidth: 250,
          flex: 1,
          display: parentWidth < 900 ? 'none' : 'block',
        }}
        slotProps={{
          primary: { align: 'left' },
        }}
      />
    </>
  );
}
