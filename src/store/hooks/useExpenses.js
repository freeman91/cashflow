import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import { findAmount } from '../../helpers/transactions';
import { getExpenses } from '../expenses';

export const useExpenses = (year, month) => {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [expenses, setExpenses] = useState([]);
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

    dispatch(getExpenses({ range: { start, end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let _expenses = filter([...allExpenses, ...allRepayments], (expense) => {
      const expenseDate = dayjs(expense.date);
      return (
        !expense.pending &&
        expenseDate.year() === year &&
        (month ? expenseDate.month() === month : true)
      );
    });
    setSum(
      reduce(
        _expenses,
        (acc, expense) => {
          return acc + findAmount(expense);
        },
        0
      )
    );
    setExpenses(_expenses);
  }, [year, month, allExpenses, allRepayments]);

  return { expenses, sum };
};

export default useExpenses;
