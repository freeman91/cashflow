import React from 'react';

import IncomesBarChart from './IncomesBarChart';

export default function IncomesView(props) {
  const { date, earnedIncomes, passiveIncomes, otherIncomes } = props;

  console.log('earnedIncomes: ', earnedIncomes);
  console.log('passiveIncomes: ', passiveIncomes);
  console.log('otherIncomes: ', otherIncomes);

  return (
    <>
      <IncomesBarChart date={date} />
    </>
  );
}
