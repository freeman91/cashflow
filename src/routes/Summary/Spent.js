import React from 'react';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import SummaryListItemValue from './SummaryListItemValue';
import ExpensesByCategory from '../../components/summary/ExpensesByCategory';

export default function Spent(props) {
  const {
    repayments,
    groupedExpenses,
    expenseSum,
    principalSum,
    interestSum,
    escrowSum,
  } = props;
  const dispatch = useDispatch();

  const openTransactionsDialog = () => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: repayments,
        id: 'repayments',
      })
    );
  };

  const totalSpent = expenseSum + principalSum + interestSum + escrowSum;
  return (
    <>
      <ExpensesByCategory groupedExpenses={groupedExpenses} />
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%' }}>
          <SummaryListItemValue value={totalSpent} label='total' />
        </Card>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%' }}>
          <SummaryListItemValue value={expenseSum} label='expenses' />
        </Card>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%' }}>
          <SummaryListItemValue
            value={principalSum + interestSum + escrowSum}
            label='repayments'
            onClick={() => openTransactionsDialog()}
          />
          <Divider sx={{ mx: 1 }} />
          <SummaryListItemValue
            value={principalSum}
            label='principal'
            gutters
            textSize='small'
          />
          <SummaryListItemValue
            value={interestSum}
            label='interest'
            gutters
            textSize='small'
          />
          <SummaryListItemValue
            value={escrowSum}
            label='escrow'
            gutters
            textSize='small'
          />
        </Card>
      </Grid>
    </>
  );
}
