import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import useTheme from '@mui/material/styles/useTheme';

import { findAmount } from '../../helpers/transactions';
import { getExpenses } from '../expenses';

export const useExpenseSummaryData = (year, month) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const allStoreExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const categoriesData = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [expenseSum, setExpenseSum] = useState(0);

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
    let _expenses = filter(
      [...allStoreExpenses, ...allRepayments],
      (expense) => {
        const expenseDate = dayjs(expense.date);
        return (
          expenseDate.isAfter(start) &&
          expenseDate.isBefore(end) &&
          !expense.pending
        );
      }
    );
    setAllExpenses(_expenses);
  }, [start, end, allStoreExpenses, allRepayments]);

  useEffect(() => {
    let expenseSum = 0;
    let principalSum = 0;
    let interestSum = 0;
    let escrowSum = 0;
    let _repayments = [];

    allExpenses.forEach((expense) => {
      if (expense._type === 'repayment') {
        _repayments.push(expense);
        principalSum += get(expense, 'principal', 0);
        interestSum += get(expense, 'interest', 0);
        escrowSum += get(expense, 'escrow', 0);
      } else if (expense._type === 'expense') {
        expenseSum += get(expense, 'amount', 0);
      }
    });

    setRepayments(_repayments);
    setExpenseSum(expenseSum);
    setPrincipalSum(principalSum);
    setInterestSum(interestSum);
    setEscrowSum(escrowSum);
  }, [allExpenses]);

  useEffect(() => {
    let _groupedExpenses = groupBy(allExpenses, 'category');
    _groupedExpenses = Object.keys(_groupedExpenses).map((key, idx) => {
      const category = find(categoriesData?.categories, { name: key });
      let color =
        category?.color || theme.chartColors[idx % theme.chartColors.length];
      const groupExpenses = _groupedExpenses[key];

      let groupedBySubcategory = groupBy(groupExpenses, 'subcategory');
      groupedBySubcategory = Object.keys(groupedBySubcategory).map((key) => {
        const subcategoryExpenses = groupedBySubcategory[key];
        return {
          name: key,
          expenses: subcategoryExpenses,
          value: reduce(
            subcategoryExpenses,
            (sum, item) => sum + findAmount(item),
            0
          ),
        };
      });
      groupedBySubcategory.sort((a, b) => b.value - a.value);

      return {
        id: key,
        name: key,
        category: key,
        color,
        expenses: groupExpenses,
        value: reduce(groupExpenses, (sum, item) => sum + findAmount(item), 0),
        subcategories: groupedBySubcategory,
      };
    });
    _groupedExpenses.sort((a, b) => b.value - a.value);
    setGroupedExpenses(_groupedExpenses);
  }, [allExpenses, theme, categoriesData]);

  return {
    allExpenses,
    repayments,
    groupedExpenses,
    expenseSum,
    principalSum,
    interestSum,
    escrowSum,
  };
};

export default useExpenseSummaryData;
