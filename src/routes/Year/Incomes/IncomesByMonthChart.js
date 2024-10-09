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
import useIncomes from '../../../store/hooks/useIncomes';
import { MONTH_NAMES } from '../Overview/MonthlyLineChart';
import { findAmount } from '../../../helpers/transactions';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const income = payload.find((item) => item.name === 'income');
    const paycheck = payload.find((item) => item.name === 'paycheck');

    const incomeValue = income ? income.value : 0;
    const paycheckValue = paycheck ? paycheck.value : 0;
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
          {incomeValue > 0 && paycheckValue > 0 && (
            <ListItemText
              primary={numberToCurrency.format(incomeValue + paycheckValue)}
              primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
              secondary='total'
              secondaryTypographyProps={{ align: 'left' }}
            />
          )}
          <ListItemText
            primary={numberToCurrency.format(income.value)}
            primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
            secondary='income'
            secondaryTypographyProps={{ align: 'left' }}
          />
          <ListItemText
            primary={numberToCurrency.format(paycheck.value)}
            primaryTypographyProps={{ fontWeight: 'bold', align: 'left' }}
            secondary='paycheck'
            secondaryTypographyProps={{ align: 'left' }}
          />
        </List>
      </Box>
    );
  }
  return null;
}

export default function IncomesByMonthChart(props) {
  const { year } = props;
  const theme = useTheme();
  const componentRef = useRef(null);
  const { incomes: yearIncomes } = useIncomes(year);

  const [incomeSumByMonth, setIncomeSumByMonth] = useState([]);
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
      let _incomes = filter(yearIncomes, (income) => {
        if (!income.date) return false;
        return dayjs(income.date).month() === idx && income._type === 'income';
      });
      let _paychecks = filter(
        yearIncomes,
        (paycheck) =>
          dayjs(paycheck.date).month() === idx && paycheck._type === 'paycheck'
      );
      return {
        month,
        income: reduce(_incomes, (sum, income) => sum + findAmount(income), 0),
        paycheck: reduce(
          _paychecks,
          (sum, paycheck) => sum + findAmount(paycheck),
          0
        ),
      };
    }).filter((item) => item.income !== 0 || item.paycheck !== 0);
    setIncomeSumByMonth(_months);
  }, [yearIncomes]);

  return (
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        ref={componentRef}
        sx={{ height: 200, maxWidth: 650, width: '100%' }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={width}
            height={height}
            data={incomeSumByMonth}
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
              dataKey='paycheck'
              fill={theme.palette.green[400]}
              stroke='transparent'
            />
            <Bar
              stackId='a'
              dataKey='income'
              fill={theme.palette.green[200]}
              stroke='transparent'
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
