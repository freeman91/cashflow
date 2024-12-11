import React, { useEffect, useState } from 'react';
import get from 'lodash/get';

import useExpenses from '../../../store/hooks/useExpenses';
import useIncomes from '../../../store/hooks/useIncomes';
import Totals from '../Totals';

export default function MonthTotals(props) {
  const { month } = props;

  const { expenses } = useExpenses(month.year(), month.month());
  const { sum: incomeSum } = useIncomes(month.year(), month.month());

  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

  useEffect(() => {
    let expenseSum = 0;
    let principalSum = 0;
    let interestSum = 0;
    let escrowSum = 0;

    expenses.forEach((expense) => {
      if (expense._type === 'repayment') {
        principalSum += get(expense, 'principal', 0);
        interestSum += get(expense, 'interest', 0);
        escrowSum += get(expense, 'escrow', 0);
      } else if (expense._type === 'expense') {
        expenseSum += get(expense, 'amount', 0);
      }
    });

    setExpenseSum(expenseSum);
    setPrincipalSum(principalSum);
    setInterestSum(interestSum);
    setEscrowSum(escrowSum);
  }, [expenses]);

  return (
    <Totals
      incomeSum={incomeSum}
      expenseSum={expenseSum}
      principalSum={principalSum}
      interestSum={interestSum}
      escrowSum={escrowSum}
    />
  );
}
