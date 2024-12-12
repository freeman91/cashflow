import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import { findAmount } from '../../helpers/transactions';
import { getIncomes } from '../incomes';
import { getPaychecks } from '../paychecks';

export const useIncomes = (year, month) => {
  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let _start = null;
    let _end = null;
    let date = dayjs().set('year', year);

    if (!month) {
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
    let _incomes = filter([...allIncomes, ...allPaychecks], (income) => {
      if (!income.date) return false;
      const incomeDate = dayjs(income.date);
      return incomeDate.isAfter(start) && incomeDate.isBefore(end);
    });
    setSum(
      reduce(
        _incomes,
        (acc, income) => {
          return acc + findAmount(income);
        },
        0
      )
    );
    setIncomes(_incomes);
  }, [start, end, allIncomes, allPaychecks]);

  return { incomes, sum };
};

export default useIncomes;
