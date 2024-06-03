import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import ExpensesTable from '../../Dashboard/ExpensesTable';

export default function LargestExpenses(props) {
  const { month, year } = props;
  const dispatch = useDispatch();
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
    <Card raised>
      <CardHeader
        title='largest expenses'
        sx={{ p: 1, pt: '4px', pb: 0 }}
        titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
        action={
          <IconButton
            size='small'
            onClick={() => dispatch(push(`/search/expenses`))}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '0px !important' }}>
        <ExpensesTable expenses={largestExpenses} />
      </CardContent>
    </Card>
  );
}
