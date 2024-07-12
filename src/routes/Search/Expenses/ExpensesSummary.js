import React, { useState } from 'react';
import get from 'lodash/get';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import { numberToCurrency } from '../../../helpers/currency';
import { useEffect } from 'react';

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
    <Card raised sx={{ mt: 1 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
        <Stack
          spacing={1}
          direction='row'
          justifyContent='space-between'
          sx={{ alignItems: 'flex-start' }}
        >
          <List disablePadding sx={{ width: '50%' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='spent'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(
                  expenseSum + principalSum + interestSum + escrowSum
                )}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <Divider />
            <ListItem disableGutters disablePadding>
              <ListItemText sx={{ width: '30%' }} secondary='expenses' />
              <ListItemText primary={numberToCurrency.format(expenseSum)} />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText sx={{ width: '30%' }} secondary='repayments' />
              <ListItemText
                primary={numberToCurrency.format(
                  principalSum + interestSum + escrowSum
                )}
              />
            </ListItem>
          </List>
          <List disablePadding sx={{ width: '50%' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText sx={{ width: '30%' }} secondary='principal' />
              <ListItemText primary={numberToCurrency.format(principalSum)} />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText sx={{ width: '30%' }} secondary='interest' />
              <ListItemText primary={numberToCurrency.format(interestSum)} />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText sx={{ width: '30%' }} secondary='escrow' />
              <ListItemText primary={numberToCurrency.format(escrowSum)} />
            </ListItem>
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
}
