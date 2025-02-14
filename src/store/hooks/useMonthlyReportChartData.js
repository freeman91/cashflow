import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

import {
  findAmount,
  findPaycheckContributionSum,
} from '../../helpers/transactions';
import { getIncomes } from '../incomes';
import { getPaychecks } from '../paychecks';
import { getSales } from '../sales';
import { getExpenses } from '../expenses';
import { getRepayments } from '../repayments';

const findMonthIncomeSum = (incomes, paychecks, sales, month) => {
  const _transactions = [...incomes, ...paychecks, ...sales];
  const _transactionsInMonth = filter(_transactions, (transaction) => {
    const transactionDate = dayjs(transaction.date);
    return transactionDate.isSame(month, 'month') && !transaction.pending;
  });
  return reduce(
    _transactionsInMonth,
    (acc, transaction) => {
      if (transaction._type === 'paycheck') {
        return (
          acc +
          findAmount(transaction) +
          findPaycheckContributionSum(transaction, 'employee') +
          findPaycheckContributionSum(transaction, 'employer')
        );
      }
      if (transaction._type === 'sale') {
        return acc + get(transaction, 'gains', 0);
      }
      return acc + findAmount(transaction);
    },
    0
  );
};

const findMonthExpenseSum = (expenses, repayments, sales, month) => {
  const _transactions = [...expenses, ...repayments, ...sales];
  const _transactionsInMonth = filter(_transactions, (transaction) => {
    const transactionDate = dayjs(transaction.date);
    return transactionDate.isSame(month, 'month') && !transaction.pending;
  });
  return reduce(
    _transactionsInMonth,
    (acc, transaction) => {
      if (transaction._type === 'sale') {
        return acc + get(transaction, 'losses', 0);
      }
      return acc + findAmount(transaction);
    },
    0
  );
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
    if (!year || isNaN(month)) return;

    let _end = dayjs()
      .set('year', year)
      .set('month', month - 1)
      .set('date', 15)
      .endOf('month');
    let _start = _end.subtract(11, 'month').startOf('month');

    setStart(_start);
    setEnd(_end);
    dispatch(getExpenses({ range: { start: _start, end: _end } }));
    dispatch(getIncomes({ range: { start: _start, end: _end } }));
    dispatch(getPaychecks({ range: { start: _start, end: _end } }));
    dispatch(getRepayments({ range: { start: _start, end: _end } }));
    dispatch(getSales({ range: { start: _start, end: _end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    if (!start || !end) return;

    let _chartData = [];
    let _currentMonth = start;
    while (_currentMonth.isSameOrBefore(end, 'month')) {
      _currentMonth = _currentMonth.add(1, 'month');
      let _incomeSum = findMonthIncomeSum(
        allIncomes,
        allPaychecks,
        allSales,
        _currentMonth
      );
      let _expenseSum = findMonthExpenseSum(
        allExpenses,
        allRepayments,
        allSales,
        _currentMonth
      );
      _chartData.push({
        month: _currentMonth.format('YYYY-MM'),
        income: _incomeSum,
        expense: _expenseSum * -1,
        net: _incomeSum - _expenseSum,
      });
    }
    setChartData(_chartData);
  }, [
    start,
    end,
    allExpenses,
    allIncomes,
    allPaychecks,
    allRepayments,
    allSales,
  ]);

  return { chartData };
};

export default useMonthlyReportChartData;
