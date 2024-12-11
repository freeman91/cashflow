import React, { useEffect, useState } from 'react';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';

import useIncomes from '../../../store/hooks/useIncomes';
import Earned from '../Earned';

export default function MonthEarned(props) {
  const { month } = props;
  const { incomes, sum } = useIncomes(month.year(), month.month());

  const [paychecks, setPaychecks] = useState([]);
  const [paycheckSum, setPaycheckSum] = useState(0);
  const [groupedPaychecks, setGroupedPaychecks] = useState([]);
  const [groupedIncomes, setGroupedIncomes] = useState([]);

  useEffect(() => {
    let _incomes = filter(incomes, { _type: 'income' });
    let groupedIncomes = groupBy(_incomes, 'category');
    setGroupedIncomes(groupedIncomes);

    let _paychecks = filter(incomes, { _type: 'paycheck' });
    setPaychecks(_paychecks);
    setPaycheckSum(sumBy(_paychecks, 'take_home'));

    let groupedPaychecks = groupBy(_paychecks, 'employer');
    setGroupedPaychecks(groupedPaychecks);
  }, [incomes]);

  return (
    <Earned
      incomeSum={sum}
      paychecks={paychecks}
      paycheckSum={paycheckSum}
      groupedPaychecks={groupedPaychecks}
      groupedIncomes={groupedIncomes}
    />
  );
}
