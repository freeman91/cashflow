import React from 'react';

import ExpensesBarChart from './ExpensesBarChart';

export default function ExpensesView(props) {
  const { date, expenses, repayments } = props;

  console.log('expenses: ', expenses);
  console.log('repayments: ', repayments);

  return (
    <>
      <ExpensesBarChart date={date} />
    </>
  );
}
