import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import ExpenseSummary from './ExpenseSummary';
import { findAmount } from '../../helpers/transactions';

export default function ExpenseValuesCard(props) {
  const { date, principalSum, interestSum, escrowSum, otherExpenseSum } = props;
  const theme = useTheme();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pendingExpenseSum, setPendingExpenseSum] = useState(0);
  const [pendingPrincipalSum, setPendingPrincipalSum] = useState(0);
  const [pendingInterestSum, setPendingInterestSum] = useState(0);
  const [pendingEscrowSum, setPendingEscrowSum] = useState(0);

  useEffect(() => {
    const pendingExpenses = allExpenses.filter((expense) => {
      return date.isSame(expense.date, 'month') && expense.pending;
    });
    const pendingRepayments = allRepayments.filter((repayment) => {
      return date.isSame(repayment.date, 'month') && repayment.pending;
    });

    let expenseSum = 0;
    for (const expense of pendingExpenses) {
      expenseSum += findAmount(expense);
    }

    let principalSum = 0;
    let interestSum = 0;
    let escrowSum = 0;
    for (const repayment of pendingRepayments) {
      principalSum += get(repayment, 'principal', 0);
      interestSum += get(repayment, 'interest', 0);
      escrowSum += get(repayment, 'escrow', 0);
    }

    setPendingExpenseSum(expenseSum);
    setPendingPrincipalSum(principalSum);
    setPendingInterestSum(interestSum);
    setPendingEscrowSum(escrowSum);
  }, [allExpenses, allRepayments, date]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'summary-popover' : undefined;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  const pendingTotal =
    pendingExpenseSum +
    pendingPrincipalSum +
    pendingInterestSum +
    pendingEscrowSum;
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[24],
          },
        }}
        onClick={handleClick}
      >
        <Typography color='textSecondary' variant='h6'>
          Expenses
        </Typography>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography
            fontWeight='bold'
            variant='h5'
            sx={{ color: theme.palette.error.main }}
          >
            {numberToCurrency.format(totalExpense)}
          </Typography>
          {pendingTotal > 0 && <Typography variant='h5'>|</Typography>}
          {pendingTotal > 0 && (
            <Typography variant='h5' sx={{ color: theme.palette.warning.main }}>
              {numberToCurrency.format(pendingTotal)}
            </Typography>
          )}
        </Box>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ExpenseSummary
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          otherExpenseSum={otherExpenseSum}
        />
      </Popover>
    </>
  );
}
