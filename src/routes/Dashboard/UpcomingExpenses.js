import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import ExpensesTable from './ExpensesTable';

export default function UpcomingExpenses() {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const sevenDaysFromNow = dayjs().add(7, 'day').hour(23).minute(59);
    const upcomingExpenses = [...allExpenses, ...allRepayments].filter(
      (expense) => {
        const eDate = dayjs(expense.date);
        return eDate <= sevenDaysFromNow && expense.pending;
      }
    );

    setExpenses(sortBy(upcomingExpenses, 'date').reverse());
  }, [allExpenses, allRepayments]);

  return (
    <Card raised>
      <CardHeader
        title='upcoming expenses'
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
      <CardContent sx={{ p: '4px', pt: 0, pb: '0px !important' }}>
        <ExpensesTable expenses={expenses} />
      </CardContent>
    </Card>
  );
}
