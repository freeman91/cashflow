import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';

import { findAmount } from '../../helpers/transactions';
import { getIncomes } from '../incomes';
import { getPaychecks } from '../paychecks';
import { getSales } from '../sales';
import { getExpenses } from '../expenses';
import { getRepayments } from '../repayments';

export const PASSIVE_CATEGORIES = [
  'dividend',
  'interest',
  'rental',
  'royalties',
];

const getPaycheckContributionSum = (paycheck, type) => {
  const bContribution = get(paycheck, `benefits_contribution.${type}`, 0);
  const rContribution = get(paycheck, `retirement_contribution.${type}`, 0);
  return bContribution + rContribution;
};

export const useMonthlyReportChartData = (year, month) => {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allSales = useSelector((state) => state.sales.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!year || !month) return;

    let _end = dayjs()
      .set('year', year)
      .set('month', month - 1)
      .set('date', 15)
      .endOf('month');
    let _start = dayjs().subtract(12, 'month').startOf('month');

    setStart(_start);
    setEnd(_end);
    dispatch(getExpenses({ range: { start: _start, end: _end } }));
    dispatch(getIncomes({ range: { start: _start, end: _end } }));
    dispatch(getPaychecks({ range: { start: _start, end: _end } }));
    dispatch(getRepayments({ range: { start: _start, end: _end } }));
    dispatch(getSales({ range: { start: _start, end: _end } }));
  }, [dispatch, year, month]);

  // useEffect(() => {
  //   const monthIncomes = filter(
  //     [...allIncomes, ...allPaychecks, ...allSales],
  //     (income) => {
  //       const incomeDate = dayjs(income.date);
  //       return (
  //         incomeDate.isSameOrAfter(start, 'day') &&
  //         incomeDate.isSameOrBefore(end, 'day') &&
  //         !income.pending
  //       );
  //     }
  //   );
  //   let _earnedIncomes = remove(
  //     monthIncomes,
  //     (income) => income._type === 'paycheck'
  //   );
  //   let _passiveIncomes = remove(monthIncomes, (income) => {
  //     if (income._type === 'sale') return true;
  //     if (income.category && PASSIVE_CATEGORIES.includes(income.category))
  //       return true;
  //     return false;
  //   });
  //   let _otherIncomes = monthIncomes;

  //   let _takeHomeSum = reduce(
  //     _earnedIncomes,
  //     (acc, income) => acc + findAmount(income),
  //     0
  //   );

  //   let _employeeContributionsSum = reduce(
  //     _earnedIncomes,
  //     (acc, income) => acc + getPaycheckContributionSum(income, 'employee'),
  //     0
  //   );

  //   let _employerContributionsSum = reduce(
  //     _earnedIncomes,
  //     (acc, income) => acc + getPaycheckContributionSum(income, 'employer'),
  //     0
  //   );

  //   setEarnedIncomes({
  //     transactions: _earnedIncomes,
  //     sum: _takeHomeSum + _employeeContributionsSum + _employerContributionsSum,
  //     takeHomeSum: _takeHomeSum,
  //     employeeContributionsSum: _employeeContributionsSum,
  //     employerContributionsSum: _employerContributionsSum,
  //   });

  //   setPassiveIncomes({
  //     transactions: _passiveIncomes,
  //     sum: reduce(
  //       _passiveIncomes,
  //       (acc, income) => {
  //         if (income._type === 'sale') return acc + get(income, 'gain', 0);
  //         return acc + findAmount(income);
  //       },
  //       0
  //     ),
  //   });

  //   setOtherIncomes({
  //     transactions: _otherIncomes,
  //     sum: reduce(_otherIncomes, (acc, income) => acc + findAmount(income), 0),
  //   });
  // }, [start, end, allIncomes, allPaychecks, allSales]);

  useEffect(() => {
    if (!start || !end) return;
    let _chartData = [];
    let _currentMonth = start;
    while (_currentMonth.isSameOrBefore(end, 'month')) {
      _currentMonth = _currentMonth.add(1, 'month');
      _chartData.push({
        month: _currentMonth.format('YYYY-MM'),
        income: 150,
        expense: -100,
        net: 50,
      });
    }
    setChartData(_chartData);
  }, [start, end]);

  return { chartData };
};

export default useMonthlyReportChartData;
