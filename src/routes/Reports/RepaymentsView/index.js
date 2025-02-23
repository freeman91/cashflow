import React from 'react';

import RepaymentsBarChart from './RepaymentsBarChart';

export default function RepaymentsView(props) {
  const { date, repayments } = props;

  console.log('repayments: ', repayments);

  return (
    <>
      <RepaymentsBarChart date={date} />
    </>
  );
}
