import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';

import { findAmount } from '../../../helpers/transactions';
import ExpensesByCategory from '../../../components/summary/ExpensesByCategory';
import ExpenseTotals from '../../../components/summary/ExpenseTotals';
import Incomes from './Incomes';

export default function Summary(props) {
  const { date } = props;
  const theme = useTheme();

  const [year] = useState(dayjs(date).year());
  const [month] = useState(dayjs(date).month() + 1);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [monthExpenses, setMonthExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected === null && groupedExpenses.length > 0) {
      setSelected(groupedExpenses[0]);
    }
  }, [groupedExpenses, selected]);

  useEffect(() => {
    let _monthRepayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === year &&
        tDate.month() === month - 1 &&
        !repayment.pending
      );
    });

    let _monthExpenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        tDate.month() === month - 1 &&
        !expense.pending
      );
    });
    setMonthExpenses([..._monthRepayments, ..._monthExpenses]);
  }, [year, month, allExpenses, allRepayments, theme]);

  useEffect(() => {
    let _groupedExpenses = groupBy(monthExpenses, 'category');
    _groupedExpenses = Object.keys(_groupedExpenses).map((key) => {
      const color = theme.chartColors[key] || theme.palette.red[600];
      const groupExpenses = _groupedExpenses[key];

      let groupedBySubcategory = groupBy(groupExpenses, 'subcategory');
      groupedBySubcategory = Object.keys(groupedBySubcategory).map((key) => {
        const subcategoryExpenses = groupedBySubcategory[key];
        return {
          name: key,
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
        value: reduce(groupExpenses, (sum, item) => sum + findAmount(item), 0),
        subcategories: groupedBySubcategory,
      };
    });
    _groupedExpenses.sort((a, b) => b.value - a.value);
    setGroupedExpenses(_groupedExpenses);
  }, [monthExpenses, theme]);

  return (
    <>
      <ExpensesByCategory
        groupedExpenses={groupedExpenses}
        selected={selected}
        setSelected={setSelected}
      />
      <ExpenseTotals
        expenses={monthExpenses}
        groupedExpenses={groupedExpenses}
      />
      <Incomes year={year} month={month} />
    </>
  );
}
