import React, { useEffect, useState } from 'react';
import get from 'lodash/get';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { ListItemValue } from '../../../components/List/ListItemValue';

export default function ExpensesSummary(props) {
  const { expenses } = props;

  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

  useEffect(() => {
    let expenseSum = 0;
    let principalSum = 0;
    let interestSum = 0;
    let escrowSum = 0;

    expenses.forEach((expense) => {
      if (expense._type === 'repayment') {
        principalSum += get(expense, 'principal', 0);
        interestSum += get(expense, 'interest', 0);
        escrowSum += get(expense, 'escrow', 0);
      } else if (expense._type === 'expense') {
        expenseSum += get(expense, 'amount', 0);
      }
    });

    setExpenseSum(expenseSum);
    setPrincipalSum(principalSum);
    setInterestSum(interestSum);
    setEscrowSum(escrowSum);
  }, [expenses]);

  return (
    <Card raised sx={{ mt: 1, p: 1 }}>
      <Stack
        spacing={1}
        direction='row'
        justifyContent='space-between'
        sx={{ alignItems: 'flex-start' }}
      >
        <List disablePadding sx={{ width: '100%' }}>
          <ListItemValue
            label='total spent'
            value={expenseSum + principalSum + interestSum + escrowSum}
            fontWeight='bold'
          />
          <Divider />
          <ListItemValue label='expenses' value={expenseSum} />
          <ListItemValue
            label='repayments'
            value={principalSum + interestSum + escrowSum}
          />
          <Divider />
          <ListItemValue label='principal' value={principalSum} />
          <ListItemValue label='interest' value={interestSum} />
          <ListItemValue label='escrow' value={escrowSum} />
        </List>
      </Stack>
    </Card>
  );
}
