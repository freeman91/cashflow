import React, { useEffect, useState } from 'react';

import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import Earned from '../Earned';
import useIncomes from '../../../store/hooks/useIncomes';
import IncomesByEmployerCategory from '../../../components/summary/IncomesByEmployerCategory';

export default function YearEarned(props) {
  const { year } = props;

  const { incomes: yearIncomes } = useIncomes(year);

  const [incomeSum, setIncomeSum] = useState(0);
  const [paychecks, setPaychecks] = useState([]);
  const [paycheckSum, setPaycheckSum] = useState(0);
  const [groupedPaychecks, setGroupedPaychecks] = useState([]);
  const [groupedIncomes, setGroupedIncomes] = useState([]);

  useEffect(() => {
    const _incomes = filter(yearIncomes, { _type: 'income' });
    let groupedIncomes = groupBy(_incomes, 'category');
    setGroupedIncomes(groupedIncomes);
    setIncomeSum(reduce(_incomes, (sum, income) => sum + income.amount, 0));

    const _paychecks = filter(yearIncomes, { _type: 'paycheck' });
    let groupedPaychecks = groupBy(_paychecks, 'employer');
    setGroupedPaychecks(groupedPaychecks);
    setPaychecks(_paychecks);
    setPaycheckSum(
      reduce(_paychecks, (sum, paycheck) => sum + paycheck.take_home, 0)
    );
  }, [yearIncomes]);

  return (
    <>
      <IncomesByEmployerCategory
        groupedIncomes={groupedIncomes}
        groupedPaychecks={groupedPaychecks}
      />
      <Earned
        incomeSum={incomeSum + paycheckSum}
        paychecks={paychecks}
        paycheckSum={paycheckSum}
        groupedPaychecks={groupedPaychecks}
        groupedIncomes={groupedIncomes}
      />
    </>
  );
}
