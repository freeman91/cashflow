import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import DataBox from '../../components/DataBox';
import { openDialog } from '../../store/dialogs';

export default function ExpensesBreakdown(props) {
  const { expenses } = props;
  const dispatch = useDispatch();

  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);
  const [escrow, setEscrow] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState([]);

  useEffect(() => {
    let _principal = 0;
    let _interest = 0;
    let _escrow = 0;
    const repayments = filter(expenses, { _type: 'repayment' });
    repayments.forEach((repayment) => {
      _principal += get(repayment, 'principal', 0);
      _interest += get(repayment, 'interest', 0);
      _escrow += get(repayment, 'escrow', 0);
    });

    setPrincipal(_principal);
    setInterest(_interest);
    setEscrow(_escrow);

    let groupedExpenses = groupBy(
      filter(expenses, { _type: 'expense' }),
      'category'
    );
    groupedExpenses = map(groupedExpenses, (_expenses, category) => {
      return {
        category,
        amount: _expenses.reduce((acc, expense) => acc + expense.amount, 0),
        expenses: _expenses,
      };
    });
    setOtherExpenses(sortBy(groupedExpenses, 'amount').reverse());
  }, [expenses]);

  const handleOpenTransactions = (category, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        id: category,
        attrs: transactions,
      })
    );
  };

  return (
    <Stack
      spacing={'4px'}
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography variant='body1' color='white' sx={{ width: '100%', pl: 1 }}>
          repayments
        </Typography>
        <IconButton
          onClick={() =>
            handleOpenTransactions(
              'repayments',
              filter(expenses, (expense) => expense._type === 'repayment')
            )
          }
        >
          <MenuIcon sx={{ width: 25, height: 25 }} />
        </IconButton>
      </Box>
      <DataBox label='principal' value={principal} />
      <DataBox label='interest' value={interest} />
      <DataBox label='escrow' value={escrow} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography variant='body1' color='white' sx={{ width: '100%', pl: 1 }}>
          expenses
        </Typography>
        <IconButton
          onClick={() =>
            handleOpenTransactions(
              'expenses',
              filter(expenses, (expense) => expense._type === 'expense')
            )
          }
        >
          <MenuIcon sx={{ width: 25, height: 25 }} />
        </IconButton>
      </Box>
      {otherExpenses.map((expense) => (
        <DataBox
          key={expense.category}
          label={expense.category}
          value={expense.amount}
          onClick={() => {
            dispatch(
              openDialog({
                type: 'transactions',
                id: expense.category,
                attrs: expense.expenses,
              })
            );
          }}
        />
      ))}
    </Stack>
  );
}
