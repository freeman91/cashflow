import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import ExpensesTable from './ExpensesTable';

export default function UpcomingExpenses() {
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
    <>
      <Typography variant='body1'>upcoming expenses</Typography>
      <Card raised>
        <CardContent sx={{ p: '4px', pt: 0, pb: '0px !important' }}>
          <ExpensesTable expenses={expenses} />
        </CardContent>
      </Card>
    </>
  );
}
