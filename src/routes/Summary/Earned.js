import React from 'react';
import { useDispatch } from 'react-redux';
import sumBy from 'lodash/sumBy';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import SummaryListItemValue from './SummaryListItemValue';

export default function Earned(props) {
  const {
    incomeSum,
    paychecks,
    paycheckSum,
    groupedPaychecks,
    groupedIncomes,
  } = props;
  const dispatch = useDispatch();

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  const sortedIncomeGroups = Object.keys(groupedIncomes)
    .map((group) => ({
      name: group,
      value: sumBy(groupedIncomes[group], 'amount'),
      transactions: groupedIncomes[group],
    }))
    .sort((a, b) => b.value - a.value);
  const paycheckEmployers = Object.keys(groupedPaychecks).sort();
  return (
    <>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%' }}>
          <SummaryListItemValue value={incomeSum} label='total' />
        </Card>
      </Grid>

      {paycheckEmployers.length > 0 && (
        <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
          <Card sx={{ width: '100%' }}>
            <SummaryListItemValue
              value={paycheckSum}
              label='paychecks'
              onClick={() => openTransactionsDialog('paychecks', paychecks)}
            />
            {paycheckEmployers.map((employer) => {
              const _paychecks = groupedPaychecks[employer];
              const takeHomeSum = sumBy(_paychecks, 'take_home');
              const taxesSum = sumBy(_paychecks, 'taxes');
              const benefitsSum = sumBy(_paychecks, 'benefits');
              const retirementSum = sumBy(_paychecks, 'retirement');
              const otherSum = sumBy(_paychecks, 'other');

              return (
                <React.Fragment key={employer}>
                  <Divider sx={{ mx: 1 }} />
                  <SummaryListItemValue
                    key={employer}
                    value={takeHomeSum}
                    label={employer}
                    onClick={() => openTransactionsDialog(employer, _paychecks)}
                  />
                  {taxesSum > 0 && (
                    <SummaryListItemValue
                      value={taxesSum}
                      label='taxes'
                      gutters
                      textSize='small'
                    />
                  )}
                  {benefitsSum > 0 && (
                    <SummaryListItemValue
                      value={benefitsSum}
                      label='benefits'
                      gutters
                      textSize='small'
                    />
                  )}
                  {retirementSum > 0 && (
                    <SummaryListItemValue
                      value={retirementSum}
                      label='retirement'
                      gutters
                      textSize='small'
                    />
                  )}
                  {otherSum > 0 && (
                    <SummaryListItemValue
                      value={otherSum}
                      label='other'
                      gutters
                      textSize='small'
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Card>
        </Grid>
      )}
      {sortedIncomeGroups.length > 0 && (
        <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
          <Card sx={{ width: '100%' }}>
            {sortedIncomeGroups.map((group, idx) => {
              const { name, value, transactions } = group;

              return (
                <React.Fragment key={name}>
                  <SummaryListItemValue
                    value={value}
                    label={name}
                    onClick={() => openTransactionsDialog(name, transactions)}
                  />
                  {idx < sortedIncomeGroups.length - 1 && (
                    <Divider sx={{ mx: 1 }} />
                  )}
                </React.Fragment>
              );
            })}
          </Card>
        </Grid>
      )}
    </>
  );
}
