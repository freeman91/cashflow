import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import filter from 'lodash/filter';

import reduce from 'lodash/reduce';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CashflowContainer from '../../components/CashflowContainer';
dayjs.extend(advancedFormat);

export default function Cashflow() {
  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);

  const [date] = useState(dayjs().hour(12).minute(0));
  const [daysLeftInMonth, setDaysLeftInMonth] = useState(0);

  useEffect(() => {
    let endOfMonth = date.endOf('month');
    setDaysLeftInMonth(endOfMonth.diff(date, 'day'));
  }, [date]);

  useEffect(() => {
    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      const tDate = dayjs(income.date);
      return tDate.year() === date.year() && tDate.month() === date.month();
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      const tDate = dayjs(paycheck.date);
      return tDate.year() === date.year() && tDate.month() === date.month();
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setIncomeSum(total);
  }, [date, allIncomes, allPaychecks]);

  useEffect(() => {
    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === date.year() &&
        tDate.month() === date.month() &&
        !expense.pending
      );
    });

    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === date.year() &&
        tDate.month() === date.month() &&
        !repayment.pending
      );
    });

    total += reduce(expenses, (sum, expense) => sum + expense.amount, 0);
    total += reduce(
      repayments,
      (sum, repayment) =>
        sum + repayment.interest + (repayment.escrow ? repayment.escrow : 0),
      0
    );

    setExpenseSum(total);
    setPrincipalSum(
      reduce(repayments, (sum, repayment) => sum + repayment.principal, 0)
    );
  }, [date, allExpenses, allRepayments]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Typography variant='body1' align='center' fontWeight='bold'>
          {date.format('YYYY MMMM Do')}
        </Typography>

        <Typography variant='body1' align='center'>
          {daysLeftInMonth} days left
        </Typography>
      </div>

      <Card raised sx={{ mt: 1 }}>
        <CardHeader
          title='cash flow'
          sx={{ p: 1, pt: '4px', pb: 0 }}
          titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
          action={
            <IconButton
              size='small'
              onClick={() =>
                dispatch(push(`/summary/${date.year()}/${date.month() + 1}`))
              }
            >
              <ArrowForwardIosIcon />
            </IconButton>
          }
        />
        <CashflowContainer
          incomeSum={incomeSum}
          expenseSum={expenseSum}
          principalSum={principalSum}
        />
      </Card>
    </>
  );
}
