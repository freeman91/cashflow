import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

import { findAmount } from '../../helpers/transactions';
import { getExpenses } from '../expenses';

export const useExpenses = (year, month) => {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [sum, setSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);

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
    dispatch(getExpenses({ range: { start: _start, end: _end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let _allExpenses = filter([...allExpenses, ...allRepayments], (expense) => {
      const expenseDate = dayjs(expense.date);
      return expenseDate.isAfter(start) && expenseDate.isBefore(end);
    });

    let _expenses = filter(_allExpenses, (expense) => !expense.pending);
    let _pendingExpenses = filter(_allExpenses, (expense) => expense.pending);

    setSum(
      reduce(
        _expenses,
        (acc, expense) => {
          return acc + findAmount(expense);
        },
        0
      )
    );
    setPrincipalSum(
      reduce(
        _expenses,
        (acc, expense) => {
          return acc + get(expense, 'principal', 0);
        },
        0
      )
    );
    setPendingExpenses(_pendingExpenses);
    setExpenses(_expenses);
  }, [start, end, allExpenses, allRepayments]);

  return { expenses, pendingExpenses, sum, principalSum };
};

export default useExpenses;
