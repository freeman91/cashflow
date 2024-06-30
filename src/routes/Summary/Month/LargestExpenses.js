import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { BoxCurrencyDisplay } from '../../Dashboard/Transactions';

export default function LargestExpenses(props) {
  const { month, year } = props;
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [largestExpenses, setLargestExpenses] = useState([]);
  const [itemCount] = useState(5);

  useEffect(() => {
    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === year &&
        tDate.month() === month - 1 &&
        !repayment.pending
      );
    });

    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        tDate.month() === month - 1 &&
        !expense.pending
      );
    });

    const items = [
      ...repayments.map((repayment) => ({
        ...repayment,
        amount:
          repayment.principal +
          repayment.interest +
          (repayment.escrow ? repayment.escrow : 0),
      })),
      ...expenses,
    ];
    const sortedItems = items.sort((a, b) => b.amount - a.amount);
    setLargestExpenses(sortedItems.slice(0, itemCount));
  }, [year, month, allExpenses, allRepayments, itemCount]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px',
        px: 1,
        pb: 1,
        background: (theme) => theme.palette.surface[300],
      }}
    >
      <Stack spacing={1} direction='column'>
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          <Typography
            variant='h6'
            color='grey.0'
            fontWeight='bold'
            sx={{ pl: 1, mt: 1 }}
          >
            largest expenses
          </Typography>
        </Box>
        {map(largestExpenses, (expense) => {
          return (
            <BoxCurrencyDisplay
              key={expense.expense_id || expense.repayment_id}
              transaction={expense}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
