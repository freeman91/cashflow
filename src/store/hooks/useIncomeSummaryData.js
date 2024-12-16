import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';

import { getIncomes } from '../incomes';
import { getPaychecks } from '../paychecks';

export const useIncomeSummaryData = (year, month) => {
  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [groupedPaychecks, setGroupedPaychecks] = useState([]);
  const [groupedIncomes, setGroupedIncomes] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [incomeSum, setIncomeSum] = useState(0);
  const [paychecks, setPaychecks] = useState([]);
  const [paycheckSum, setPaycheckSum] = useState(0);

  useEffect(() => {
    if (!year) return;
    let _start = null;
    let _end = null;
    let date = dayjs().set('year', year);

    if (isNaN(month)) {
      _start = date.startOf('year');
      _end = date.endOf('year');
    } else {
      date = date.set('month', month);
      _start = date.startOf('month');
      _end = date.endOf('month');
    }

    setStart(_start);
    setEnd(_end);

    dispatch(getIncomes({ range: { start: _start, end: _end } }));
    dispatch(getPaychecks({ range: { start: _start, end: _end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let _allIncomes = [...allIncomes, ...allPaychecks];
    _allIncomes = filter(_allIncomes, (income) => {
      if (!income.date) return false;
      const incomeDate = dayjs(income.date);
      return incomeDate.isAfter(start) && incomeDate.isBefore(end);
    });

    let _incomes = filter(_allIncomes, { _type: 'income' });
    let _groupedIncomes = groupBy(_incomes, 'category');
    setGroupedIncomes(_groupedIncomes);
    setIncomes(_incomes);
    setIncomeSum(reduce(_incomes, (sum, income) => sum + income.amount, 0));

    let _paychecks = filter(_allIncomes, { _type: 'paycheck' });
    setPaychecks(_paychecks);
    setPaycheckSum(sumBy(_paychecks, 'take_home'));
    setGroupedPaychecks(groupBy(_paychecks, 'employer'));
  }, [start, end, allIncomes, allPaychecks]);

  return {
    incomes,
    groupedIncomes,
    incomeSum,
    groupedPaychecks,
    paychecks,
    paycheckSum,
  };
};

export default useIncomeSummaryData;
