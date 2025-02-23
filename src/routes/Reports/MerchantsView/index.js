import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

import useTheme from '@mui/material/styles/useTheme';

import MerchantsPieChart from './MerchantsPieChart';
import MerchantsTable from './MerchantsTable';
import { findAmount } from '../../../helpers/transactions';

export default function MerchantsView(props) {
  const { expenses, repayments, lossSales } = props;
  const theme = useTheme();

  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [chartData, setChartData] = useState([]);
  const [expenseTotal, setExpenseTotal] = useState(0);

  useEffect(() => {
    let _allExpenses = [...expenses, ...repayments, ...lossSales];
    setGroupedExpenses(groupBy(_allExpenses, 'merchant'));
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
    _chartData.map((item, idx) => {
      item.color = theme.chartColors[idx % theme.chartColors.length];
      return item;
    });
    setChartData(_chartData);
    setExpenseTotal(_chartData.reduce((acc, item) => acc + item.value, 0));
  }, [groupedExpenses, theme.chartColors]);

  return (
    <>
      <MerchantsPieChart chartData={chartData} expenseTotal={expenseTotal} />
      <MerchantsTable chartData={chartData} groupedExpenses={groupedExpenses} />
    </>
  );
}
