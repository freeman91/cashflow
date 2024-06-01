import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { getExpenses } from '../../store/expenses';
import { getIncomes } from '../../store/incomes';
import { getPaychecks } from '../../store/paychecks';
import CashflowContainer from '../../components/CashflowContainer';

export default function MonthSummary(props) {
  const { year, month } = props;
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);

  useEffect(() => {
    const start = dayjs()
      .year(year)
      .month(month - 1)
      .startOf('month');
    const end = dayjs().year(year).month(month).endOf('month');

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      const tDate = dayjs(income.date);
      return tDate.year() === Number(year);
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      const tDate = dayjs(paycheck.date);
      return tDate.year() === Number(year) && tDate.month() === month - 1;
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setIncomeSum(total);
  }, [year, month, allIncomes, allPaychecks]);

  useEffect(() => {
    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        tDate.month() === month - 1 &&
        !expense.pending
      );
    });

    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === Number(year) &&
        tDate.month() === month - 1 &&
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
  }, [year, month, allExpenses, allRepayments]);

  return (
    <>
      <Grid item xs={12}>
        <Card raised>
          <CardHeader
            title={dayjs()
              .year(year)
              .month(month - 1)
              .format('YYYY MMMM')}
            sx={{ p: 1, pt: '4px', pb: 0 }}
            titleTypographyProps={{
              variant: 'h5',
              fontWeight: 'bold',
              align: 'center',
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card raised>
          <CashflowContainer
            incomeSum={incomeSum}
            expenseSum={expenseSum}
            principalSum={principalSum}
          />
        </Card>
      </Grid>
    </>
  );
}
