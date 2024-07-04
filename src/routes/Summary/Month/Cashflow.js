import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import CashflowContainer from '../../../components/CashflowContainer';

export default function Cashflow(props) {
  const { year, month } = props;
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [date, setDate] = useState(null);
  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);

  useEffect(() => {
    if (year && month) {
      const _month = month - 1;
      setDate(dayjs().year(year).month(_month));
    }
  }, [dispatch, year, month]);

  useEffect(() => {
    if (!date) return;

    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      return dayjs(income.date).isSame(date, 'month');
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      return dayjs(paycheck.date).isSame(date, 'month');
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setIncomeSum(total);
  }, [date, allIncomes, allPaychecks]);

  useEffect(() => {
    if (!date) return;

    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      return dayjs(expense.date).isSame(date, 'month') && !expense.pending;
    });

    let repayments = filter(allRepayments, (repayment) => {
      return dayjs(repayment.date).isSame(date, 'month') && !repayment.pending;
    });

    total += reduce(expenses, (sum, expense) => sum + expense.amount, 0);
    total += reduce(
      repayments,
      (sum, repayment) =>
        sum +
        repayment.principal +
        repayment.interest +
        (repayment.escrow ? repayment.escrow : 0),
      0
    );

    setExpenseSum(total);
  }, [date, allExpenses, allRepayments]);

  return (
    <CashflowContainer
      date={date?.format('YYYY MMMM')}
      incomeSum={incomeSum}
      expenseSum={expenseSum}
    />
  );
}
