import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { PieChart } from '@mui/x-charts/PieChart';
import { numberToCurrency } from '../../../helpers/currency';

export default function CustomPieChart(props) {
  const { year, month } = props;
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [groupedExpenses, setGroupedExpenses] = useState([]);

  useEffect(() => {
    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === year &&
        tDate.month() === month - 1 &&
        !repayment.pending
      );
    });

    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        tDate.month() === month - 1 &&
        !expense.pending
      );
    });

    const items = [
      ...repayments.map((repayment) => ({
        ...repayment,
        amount:
          repayment.principal +
          repayment.interest +
          (repayment.escrow ? repayment.escrow : 0),
      })),
      ...expenses,
    ];

    let _groupedExpenses = groupBy(items, 'category');
    _groupedExpenses = Object.keys(_groupedExpenses).map((key) => {
      return {
        id: key,
        label: key,
        value: reduce(
          _groupedExpenses[key],
          (sum, item) => sum + item.amount,
          0
        ),
      };
    });
    _groupedExpenses.sort((a, b) => b.value - a.value);
    setGroupedExpenses(_groupedExpenses);
  }, [year, month, allExpenses, allRepayments]);

  return (
    <Card raised>
      <CardHeader
        title='expenses by category'
        sx={{ p: 1, pt: '4px', pb: 0 }}
        titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '8px !important' }}>
        <PieChart
          series={[
            {
              valueFormatter: (item) => numberToCurrency.format(item.value),
              data: groupedExpenses,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: {
                innerRadius: 10,
                additionalRadius: -10,
                color: 'gray',
              },
            },
          ]}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          width={350}
          height={250}
        />
      </CardContent>
    </Card>
  );
}
