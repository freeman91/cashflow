import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import BoxFlexColumn from '../../../components/BoxFlexColumn';

export default function ExpensesByCategory(props) {
  const { year, month } = props;
  const theme = useTheme();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
  }, [year, month]);

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
      const color = theme.chartColors[key] || theme.palette.red[600];
      return {
        id: key,
        label: key,
        category: key,
        color,
        value: reduce(
          _groupedExpenses[key],
          (sum, item) => sum + item.amount,
          0
        ),
      };
    });
    _groupedExpenses.sort((a, b) => b.value - a.value);
    setExpenses(_groupedExpenses);
  }, [year, month, allExpenses, allRepayments, theme]);

  useEffect(() => {
    let _incomes = filter(allIncomes, (income) => {
      const tDate = dayjs(income.date);
      return tDate.year() === year && tDate.month() === month - 1;
    });

    let paychecks = filter(allPaychecks, (paycheck) => {
      const tDate = dayjs(paycheck.date);
      return tDate.year() === Number(year) && tDate.month() === month - 1;
    });

    const items = [
      ..._incomes,
      ...paychecks.map((paycheck) => {
        return {
          ...paycheck,
          category: paycheck.employer,
          amount: paycheck.take_home,
        };
      }),
    ];

    let _groupedExpenses = groupBy(items, 'category');
    _groupedExpenses = Object.keys(_groupedExpenses).map((key, idx) => {
      let color = theme.palette.green.chart[key] || theme.palette.green[200];
      return {
        id: key,
        label: key,
        category: key,
        color,
        value: reduce(
          _groupedExpenses[key],
          (sum, item) => sum + item.amount,
          0
        ),
      };
    });
    _groupedExpenses.sort((a, b) => b.value - a.value);
    setIncomes(_groupedExpenses);
  }, [year, month, allIncomes, allPaychecks, theme]);

  const handleClick = (e, type, catIdx) => {
    if (type === 'expense') {
      setSelected(expenses[catIdx]);
    } else {
      setSelected(incomes[catIdx]);
    }
  };

  return (
    <Box
      sx={{
        background: (theme) =>
          `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[250]})`,
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
      }}
    >
      {selected && (
        <Box
          sx={{
            position: 'relative',
            height: 0,
            top: 25,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              background: theme.palette.surface[300],
              px: 2,
              pt: '4px',
              borderRadius: '10px',
              boxShadow: 4,
            }}
          >
            <BoxFlexColumn alignItems='flex-start'>
              <BoxFlexCenter>
                <Box
                  sx={{
                    backgroundColor: selected.color,
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '3px',
                    mr: 1,
                  }}
                />
                <Typography variant='body2' color='grey.0'>
                  {selected.category}
                </Typography>
              </BoxFlexCenter>
              <BoxFlexCenter>
                <Typography variant='h5' color='grey.10'>
                  $
                </Typography>
                <Typography variant='h5' color='white' fontWeight='bold'>
                  {_numberToCurrency.format(selected.value)}
                </Typography>
              </BoxFlexCenter>
            </BoxFlexColumn>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <ResponsiveContainer width='50%' height={225}>
          <PieChart width={200} height={225}>
            <Pie
              data={incomes}
              dataKey='value'
              fill={theme.palette.green[400]}
              onClick={(e, catIdx) => handleClick(e, 'income', catIdx)}
            >
              {incomes.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width='50%' height={225}>
          <PieChart width={200} height={225}>
            <Pie
              data={expenses}
              dataKey='value'
              fill={theme.palette.red[600]}
              onClick={(e, catIdx) => handleClick(e, 'expense', catIdx)}
            >
              {expenses.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
