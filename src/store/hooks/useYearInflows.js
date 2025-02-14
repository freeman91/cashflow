import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';

import {
  findAmount,
  findPaycheckContributionSum,
} from '../../helpers/transactions';
import { getIncomes } from '../incomes';
import { getPaychecks } from '../paychecks';
import { getSales } from '../sales';

export const PASSIVE_CATEGORIES = [
  'dividend',
  'interest',
  'rental',
  'royalties',
];

export const useYearInflows = (year) => {
  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allSales = useSelector((state) => state.sales.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [earnedIncomes, setEarnedIncomes] = useState({
    transactions: [],
    sum: 0,
    takeHomeSum: 0,
    contributionsSum: 0,
  });
  const [passiveIncomes, setPassiveIncomes] = useState({
    transactions: [],
    sum: 0,
  });
  const [otherIncomes, setOtherIncomes] = useState({
    transactions: [],
    sum: 0,
  });

  useEffect(() => {
    if (!year) return;

    let _start = null;
    let _end = null;
    let date = dayjs().set('year', year);

    _start = date.startOf('year');
    _end = date.endOf('year');

    setStart(_start);
    setEnd(_end);
    dispatch(getIncomes({ range: { start: _start, end: _end } }));
    dispatch(getPaychecks({ range: { start: _start, end: _end } }));
    dispatch(getSales({ range: { start: _start, end: _end } }));
  }, [dispatch, year]);

  useEffect(() => {
    if (!start || !end) return;
    const midYear = start.month(6).date(15);
    const yearIncomes = filter(
      [...allIncomes, ...allPaychecks, ...allSales],
      (income) => {
        const incomeDate = dayjs(income.date);
        return incomeDate.isSame(midYear, 'year') && !income.pending;
      }
    );
    let _earnedIncomes = remove(
      yearIncomes,
      (income) => income._type === 'paycheck'
    );
    let _passiveIncomes = remove(yearIncomes, (income) => {
      if (income._type === 'sale') return true;
      if (income.category && PASSIVE_CATEGORIES.includes(income.category))
        return true;
      return false;
    });
    let _otherIncomes = yearIncomes;

    let _takeHomeSum = reduce(
      _earnedIncomes,
      (acc, income) => acc + findAmount(income),
      0
    );

    let _employeeContributionsSum = reduce(
      _earnedIncomes,
      (acc, income) => acc + findPaycheckContributionSum(income, 'employee'),
      0
    );

    let _employerContributionsSum = reduce(
      _earnedIncomes,
      (acc, income) => acc + findPaycheckContributionSum(income, 'employer'),
      0
    );

    setEarnedIncomes({
      transactions: _earnedIncomes,
      sum: _takeHomeSum + _employeeContributionsSum + _employerContributionsSum,
      takeHomeSum: _takeHomeSum,
      employeeContributionsSum: _employeeContributionsSum,
      employerContributionsSum: _employerContributionsSum,
    });

    setPassiveIncomes({
      transactions: _passiveIncomes,
      sum: reduce(
        _passiveIncomes,
        (acc, income) => {
          if (income._type === 'sale') return acc + get(income, 'gains', 0);
          return acc + findAmount(income);
        },
        0
      ),
    });

    setOtherIncomes({
      transactions: _otherIncomes,
      sum: reduce(_otherIncomes, (acc, income) => acc + findAmount(income), 0),
    });
  }, [start, end, allIncomes, allPaychecks, allSales]);

  return {
    earnedIncomes,
    passiveIncomes,
    otherIncomes,
  };
};

export default useYearInflows;
