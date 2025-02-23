import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import range from 'lodash/range';
import groupBy from 'lodash/groupBy';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { numberToCurrency } from '../../../helpers/currency';
import { findAmount } from '../../../helpers/transactions';
import {
  NEEDS,
  WANTS,
  LUXURIES,
} from '../../Settings/CategoryList/Subcategory';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const date = dayjs.unix(label).format('MMM YYYY');

    const _payload = cloneDeep(payload);

    const total = _payload.reduce((acc, item) => acc + item.value, 0);
    return (
      <List
        disablePadding
        sx={{
          bgcolor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[24],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          py: 0.5,
        }}
      >
        <ListItemText
          primary={date}
          slotProps={{ primary: { align: 'center', variant: 'h6' } }}
        />
        {_payload.reverse().map((item) => {
          return (
            <ListItem
              key={item.name}
              sx={{ display: 'flex', gap: 1, px: 1, py: 0 }}
            >
              <Box sx={{ height: 10, width: 10, bgcolor: item.color }} />
              <ListItemText secondary={item.name} />
              <ListItemText
                primary={numberToCurrency.format(item.value)}
                slotProps={{
                  primary: { align: 'right' },
                }}
              />
            </ListItem>
          );
        })}
        <Divider sx={{ width: '100%', my: 0.5 }} />
        <ListItemText
          primary={numberToCurrency.format(total)}
          slotProps={{ primary: { align: 'center' } }}
        />
      </List>
    );
  }
  return null;
}

export default function IncomesBarChart(props) {
  const { date } = props;
  const theme = useTheme();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allSales = useSelector((state) => state.sales.data);
  const categoriesState = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    })?.categories;
  });

  const [labeledExpenses, setLabeledExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let _labeledData = [];
    let currMonth = date.date(15);
    range(12).forEach((idx) => {
      const expenses = [...allExpenses, ...allRepayments].filter((expense) => {
        const expenseDate = dayjs(expense.date);
        return (
          expenseDate.isSame(currMonth, 'month') &&
          !get(expense, 'pending', false)
        );
      });

      const sales = allSales.filter((sale) => {
        const saleDate = dayjs(sale.date);
        return (
          saleDate.isSame(currMonth, 'month') && get(sale, 'losses', 0) > 0
        );
      });

      const allSubcategories = categoriesState.flatMap(
        (category) => category.subcategories
      );
      let groupedExpenses = groupBy(expenses, 'subcategory');
      let labeledExpenses = {};
      Object.keys(groupedExpenses).forEach((subcategory) => {
        const label = find(allSubcategories, {
          name: subcategory,
        })?.label;
        const subcategoryTotal = groupedExpenses[subcategory].reduce(
          (acc, expense) => acc + findAmount(expense),
          0
        );

        if (label in labeledExpenses) {
          labeledExpenses[label].sum += subcategoryTotal;
          labeledExpenses[label].transactions.push(
            ...groupedExpenses[subcategory]
          );
        } else {
          labeledExpenses[label] = {
            sum: subcategoryTotal,
            transactions: groupedExpenses[subcategory],
          };
        }
      });

      const capitalLosses = sales.reduce((acc, sale) => acc + sale.losses, 0);
      if (LUXURIES in labeledExpenses) {
        labeledExpenses[LUXURIES].sum += capitalLosses;
        labeledExpenses[LUXURIES].transactions.push(...sales);
      } else {
        labeledExpenses[LUXURIES] = {
          sum: capitalLosses,
          transactions: sales,
        };
      }

      _labeledData.push({
        month: currMonth.unix(),
        ...labeledExpenses,
      });
      currMonth = currMonth.subtract(1, 'month');
    });

    setLabeledExpenses(_labeledData.reverse());
  }, [allExpenses, allRepayments, allSales, date, categoriesState]);

  useEffect(() => {
    setChartData(
      labeledExpenses.map((item) => {
        return {
          month: item.month,
          [NEEDS]: item[NEEDS]?.sum || 0,
          [WANTS]: item[WANTS]?.sum || 0,
          [LUXURIES]: item[LUXURIES]?.sum || 0,
        };
      })
    );
  }, [labeledExpenses]);

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          pt: 1,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <ResponsiveContainer
            width='100%'
            height={200}
            style={{ '& .rechartsSurface': { overflow: 'visible' } }}
          >
            <BarChart
              width='100%'
              height={200}
              data={chartData}
              stackOffset='sign'
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 0,
              }}
            >
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey='month'
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => {
                  return dayjs.unix(value).format('MMM YYYY');
                }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Bar
                stackId='a'
                dataKey={NEEDS}
                fill={theme.palette.primary.main}
                stroke='transparent'
                radius={[3, 3, 3, 3]}
                barSize={40}
                minPointSize={5}
              />
              <Bar
                stackId='a'
                dataKey={WANTS}
                fill={theme.palette.yellow.main}
                stroke='transparent'
                radius={[3, 3, 3, 3]}
                barSize={40}
                minPointSize={5}
              />
              <Bar
                stackId='a'
                dataKey={LUXURIES}
                fill={theme.palette.orange.main}
                stroke='transparent'
                radius={[3, 3, 3, 3]}
                barSize={40}
                minPointSize={5}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Grid>
  );
}
