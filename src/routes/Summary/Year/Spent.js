import React, { useEffect, useState } from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import useTheme from '@mui/material/styles/useTheme';

import useExpenses from '../../../store/hooks/useExpenses';
import { findAmount } from '../../../helpers/transactions';
import Spent from '../Spent';
import { useSelector } from 'react-redux';

export default function YearSpent(props) {
  const { year } = props;
  const theme = useTheme();

  const categoriesData = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const { expenses } = useExpenses(year);

  const [repayments, setRepayments] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

  useEffect(() => {
    let expenseSum = 0;
    let principalSum = 0;
    let interestSum = 0;
    let escrowSum = 0;
    let _repayments = [];

    expenses.forEach((expense) => {
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
  }, [expenses]);

  useEffect(() => {
    let _groupedExpenses = groupBy(expenses, 'category');
    let categories = Object.keys(_groupedExpenses);
    _groupedExpenses = categories.map((key, idx) => {
      const category = find(categoriesData.categories, { name: key });
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
  }, [expenses, theme, categoriesData]);

  return (
    <Spent
      repayments={repayments}
      groupedExpenses={groupedExpenses}
      expenseSum={expenseSum}
      principalSum={principalSum}
      interestSum={interestSum}
      escrowSum={escrowSum}
    />
  );
}
