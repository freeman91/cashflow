import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import CashflowContainer from '../CashflowContainer';

export default function Cashflow(props) {
  const { year } = props;
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [date, setDate] = useState(null);
  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);

  useEffect(() => {
    if (year) {
      setDate(dayjs(`${year}-06-15`));
    }
  }, [dispatch, year]);

  useEffect(() => {
    if (!date) return;

    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      return dayjs(income.date).isSame(date, 'year');
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      return dayjs(paycheck.date).isSame(date, 'year');
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setIncomeSum(total);
  }, [date, allIncomes, allPaychecks]);

  useEffect(() => {
    if (!date) return;

    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      return dayjs(expense.date).isSame(date, 'year') && !expense.pending;
    });

    let repayments = filter(allRepayments, (repayment) => {
      return dayjs(repayment.date).isSame(date, 'year') && !repayment.pending;
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
    <CashflowContainer
      incomeSum={incomeSum}
      expenseSum={expenseSum}
      principalSum={principalSum}
    />
  );
}
