import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import uniq from 'lodash/uniq';

export const useIncomeSources = () => {
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [sources, setSources] = useState([]);

  useEffect(() => {
    let _incomes = [...allIncomes, ...allPaychecks];
    let _sources = uniq(
      _incomes.map((income) => income.source || income.employer)
    );
    setSources(_sources);
  }, [allIncomes, allPaychecks]);

  return sources;
};

export default useIncomeSources;
