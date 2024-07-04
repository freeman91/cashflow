import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { TransactionBox } from '../../../components/TransactionBox';

export default function LargestExpenses(props) {
  const { month, year } = props;
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [largestExpenses, setLargestExpenses] = useState([]);
  const [itemCount, setItemCount] = useState(5);

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
        borderRadius: '10px',
        px: 1,
        pb: 1,
        background: (theme) => theme.palette.surface[250],
      }}
    >
      <Stack spacing={1} direction='column'>
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
          <FormControl
            sx={{ minWidth: 120, mt: 1 }}
            size='small'
            variant='standard'
          >
            <Select
              value={itemCount}
              label='item count'
              onChange={(event) => {
                setItemCount(event.target.value);
              }}
              MenuProps={{ MenuListProps: { disablePadding: true } }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {map(largestExpenses, (expense) => {
          return (
            <TransactionBox
              key={expense.expense_id || expense.repayment_id}
              transaction={expense}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
