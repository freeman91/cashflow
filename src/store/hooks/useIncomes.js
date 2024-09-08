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

  const [incomes, setIncomes] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let start = null;
    let end = null;
    let date = dayjs().set('year', year);

    if (!month) {
      start = date.startOf('year');
      end = date.endOf('year');
    } else {
      date = date.set('month', month);
      start = date.startOf('month');
      end = date.endOf('month');
    }

    dispatch(getIncomes({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let _incomes = filter([...allIncomes, ...allPaychecks], (income) => {
      if (!income.date) return false;
      const incomeDate = dayjs(income.date);
      return (
        incomeDate.year() === year &&
        (month ? incomeDate.month() === month : true)
      );
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
  }, [year, month, allIncomes, allPaychecks]);

  return { incomes, sum };
};

export default useIncomes;
