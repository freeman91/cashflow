import React, { useEffect, useRef, useState } from 'react';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { numberToCurrency } from '../../../helpers/currency';
import { findAmount } from '../../../helpers/transactions';
import useExpenses from '../../../store/hooks/useExpenses';
import { MONTH_NAMES } from '../Overview/MonthlyLineChart';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const expense = payload.find((item) => item.name === 'expense');
    const repayment = payload.find((item) => item.name === 'repayment');

    const expenseValue = expense ? expense.value : 0;
    const repaymentValue = repayment ? repayment.value : 0;
    return (
      <Box
        sx={{
          bgcolor: 'surface.300',
          borderRadius: 1,
          boxShadow: (theme) => theme.shadows[8],
          px: 2,
          py: 0.5,
        }}
      >
        <List disablePadding sx={{ pb: '0 !important' }}>
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              align: 'center',
              color: 'text.secondary',
            }}
          />
          {repaymentValue > 0 && expenseValue > 0 && (
            <ListItemText
              primary={numberToCurrency.format(repaymentValue + expenseValue)}
              primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
              secondary='total'
              secondaryTypographyProps={{ align: 'left' }}
            />
          )}
          <ListItemText
            primary={numberToCurrency.format(repaymentValue)}
            primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
            secondary='repayment'
            secondaryTypographyProps={{ align: 'left' }}
          />
          <ListItemText
            primary={numberToCurrency.format(expenseValue)}
            primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
            secondary='expense'
            secondaryTypographyProps={{ align: 'left' }}
          />
        </List>
      </Box>
    );
  }
  return null;
}

export default function ExpensesByMonthChart(props) {
  const { year } = props;
  const theme = useTheme();
  const componentRef = useRef(null);
  const { expenses: yearExpenses } = useExpenses(year);

  const [expenseSumByMonth, setExpenseSumByMonth] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (componentRef.current) {
      setWidth(componentRef.current.offsetWidth);
      setHeight(componentRef.current.offsetHeight);
    }
  }, [componentRef]);

  useEffect(() => {
    let _months = MONTH_NAMES.map((month, idx) => {
      let _expenses = filter(
        yearExpenses,
        (expense) =>
          dayjs(expense.date).month() === idx && expense._type === 'expense'
      );
      let _repayments = filter(
        yearExpenses,
        (repayment) =>
          dayjs(repayment.date).month() === idx &&
          repayment._type === 'repayment'
      );
      return {
        month,
        expense: reduce(
          _expenses,
          (sum, expense) => sum + findAmount(expense),
          0
        ),
        repayment: reduce(
          _repayments,
          (sum, repayment) => sum + findAmount(repayment),
          0
        ),
      };
    }).filter((item) => item.expense !== 0 || item.repayment !== 0);
    setExpenseSumByMonth(_months);
  }, [yearExpenses]);

  return (
    <Grid item xs={12}>
      <Box ref={componentRef} sx={{ height: 200 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={width}
            height={height}
            data={expenseSumByMonth}
            margin={{
              top: 5,
              right: 5,
              bottom: 5,
              left: 5,
            }}
          >
            <XAxis dataKey='month' axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Bar
              stackId='a'
              dataKey='expense'
              fill={theme.palette.red[400]}
              stroke='transparent'
            />
            <Bar
              stackId='a'
              dataKey='repayment'
              fill={theme.palette.red[200]}
              stroke='transparent'
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
