import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { useTheme } from '@mui/styles';
import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { get, groupBy, map, range, reduce } from 'lodash';
import { numberToCurrency } from '../../../helpers/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card raised>
        <CardContent>
          <List disablePadding sx={{ width: '15rem' }}>
            <ListItem disablePadding>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ align: 'center' }}
              />
            </ListItem>
            {map(payload, (value) => {
              return (
                <ListItem disablePadding key={value.dataKey}>
                  <ListItemText
                    primary={value.name}
                    primaryTypographyProps={{ align: 'left' }}
                  />
                  <ListItemText
                    primary={numberToCurrency.format(value.value)}
                    primaryTypographyProps={{ align: 'right' }}
                  />
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default function YearChart({ incomes, expenses }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let groupedIncomes = groupBy(incomes, (income) => {
      let date = dayjs(income.date);
      return date.month();
    });
    let groupedExpenses = groupBy(expenses, (expense) => {
      let date = dayjs(expense.date);
      return date.month();
    });

    let data = map(range(12), (month) => {
      let monthIncome = reduce(
        groupedIncomes[month],
        (acc, income) => acc + get(income, 'amount', 0),
        0
      );
      let monthExpense = reduce(
        groupedExpenses[month],
        (acc, expenses) => acc + get(expenses, 'amount', 0),
        0
      );

      return {
        month: dayjs().month(month).format('MMMM'),
        income: monthIncome,
        expense: monthExpense,
        net: monthIncome - monthExpense,
      };
    });
    setChartData(data);
  }, [incomes, expenses]);

  return (
    <Grid
      item
      xs={12}
      justifyContent='center'
      display='flex'
      height={300}
      mt={2}
    >
      <ResponsiveContainer width={1000} height='100%'>
        <BarChart
          width={400}
          height={300}
          data={chartData}
          margin={{ left: 35 }}
        >
          <XAxis dataKey='month' />
          <YAxis tickFormatter={(value) => numberToCurrency.format(value)} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey='income' fill={theme.palette.green[500]} />
          <Bar dataKey='expense' fill={theme.palette.red[500]} />
          <Bar dataKey='net' fill={theme.palette.blue[500]} />
        </BarChart>
      </ResponsiveContainer>
    </Grid>
  );
}
