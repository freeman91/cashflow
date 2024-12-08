import React from 'react';
import dayjs from 'dayjs';

import CashflowContainer from '../../../components/CashflowContainer';
import useExpenses from '../../../store/hooks/useExpenses';
import useIncomes from '../../../store/hooks/useIncomes';

export default function Cashflow(props) {
  const { year, month } = props;

  const { sum: expenseSum, principalSum } = useExpenses(year, month);
  const { sum: incomeSum } = useIncomes(year, month);

  const date = dayjs().set('year', year).set('month', month);
  return (
    <CashflowContainer
      dateStr={date.format('MMMM')}
      incomeSum={incomeSum}
      expenseSum={expenseSum}
      principalSum={principalSum}
    />
  );
}
