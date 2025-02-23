import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

import CategoryPieChart from './CategoriesPieChart';
import CategoryTable from './CategoriesTable';
import { findAmount } from '../../../helpers/transactions';

export default function CategoriesView(props) {
  const { expenses, repayments, lossSales } = props;

  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [chartData, setChartData] = useState([]);
  const [expenseTotal, setExpenseTotal] = useState(0);

  useEffect(() => {
    let _allExpenses = [...expenses, ...repayments];
    _allExpenses = groupBy(_allExpenses, 'category');
    _allExpenses['capitalLosses'] = lossSales;
    setGroupedExpenses(_allExpenses);
  }, [expenses, repayments, lossSales]);

  useEffect(() => {
    const _chartData = [];
    for (const [key, transactions] of Object.entries(groupedExpenses)) {
      const sum = transactions.reduce((acc, transaction) => {
        if (transaction._type === 'sale') {
          return acc + get(transaction, 'losses', 0);
        }
        return acc + findAmount(transaction);
      }, 0);
      _chartData.push({ name: key, value: sum });
    }
    _chartData.sort((a, b) => b.value - a.value);
    setChartData(_chartData);
    setExpenseTotal(_chartData.reduce((acc, item) => acc + item.value, 0));
  }, [groupedExpenses]);

  return (
    <>
      <CategoryPieChart chartData={chartData} expenseTotal={expenseTotal} />
      <CategoryTable chartData={chartData} groupedExpenses={groupedExpenses} />
    </>
  );
}
