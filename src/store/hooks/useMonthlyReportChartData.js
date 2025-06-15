import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

import { findAmount } from '../../helpers/transactions';
import { getIncomes } from '../incomes';
import { getPaychecks } from '../paychecks';
import { getSales } from '../sales';
import { getExpenses } from '../expenses';
import { getRepayments } from '../repayments';

const findMonthIncomeSum = (incomes, paychecks, sales, date) => {
  const monthIncomes = filter(
    [...incomes, ...paychecks, ...sales],
    (income) => {
      const incomeDate = dayjs(income.date);
      return incomeDate.isSame(date, 'month') && !get(income, 'pending', false);
    }
  );

  return reduce(
    monthIncomes,
    (acc, income) => {
      if (income._type === 'sale') return acc + get(income, 'gains', 0);
      return acc + findAmount(income);
    },
    0
  );
};

const findMonthExpenseSum = (expenses, repayments, sales, date) => {
  const monthExpenses = filter([...expenses, ...repayments], (expense) => {
    const expenseDate = dayjs(expense.date);
    return expenseDate.isSame(date, 'month') && !get(expense, 'pending', false);
  });

  const monthSales = filter(sales, (sale) => {
    const saleDate = dayjs(sale.date);
    return saleDate.isSame(date, 'month') && get(sale, 'losses', 0) > 0;
  });

  const expenseSum = reduce(
    monthExpenses,
    (acc, expense) => {
      return acc + findAmount(expense);
    },
    0
  );

  const saleLosses = reduce(
    monthSales,
    (acc, sale) => {
      return acc + get(sale, 'losses', 0);
    },
    0
  );

  return expenseSum + saleLosses;
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
    if (!year) return;

    let _start = null;
    let _end = null;

    if (isNaN(month)) {
      // Year view - show all months of the year
      _start = dayjs().set('year', year).startOf('year');
      _end = dayjs().set('year', year).endOf('year');
    } else {
      // Month view - show 12 months ending at the selected month
      _end = dayjs()
        .set('year', year)
        .set('month', month - 1)
        .set('date', 15)
        .endOf('month');
      _start = _end.subtract(11, 'month').startOf('month');
    }

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
      _currentMonth = _currentMonth.add(1, 'month');
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
