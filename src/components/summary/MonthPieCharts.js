import React, { useEffect, useState } from 'react';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';

import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Cell, PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../BoxFlexCenter';

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    selectedFill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={selectedFill}
        cornerRadius={5}
      />
    </g>
  );
};

export default function MonthPieCharts(props) {
  const { groupedIncomes, groupedPaychecks, groupedExpenses } = props;
  const theme = useTheme();

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [activeExpenseIndex, setActiveExpenseIndex] = useState(0);
  const [activeIncomeIndex, setActiveIncomeIndex] = useState(0);
  const [incomeData, setIncomeData] = useState([]);
  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const _selected = groupedExpenses[activeExpenseIndex];
    setSelectedExpense(_selected);
  }, [activeExpenseIndex, groupedExpenses]);

  useEffect(() => {
    const _selected = incomeData[activeIncomeIndex];
    setSelectedIncome(_selected);
  }, [activeIncomeIndex, incomeData]);

  useEffect(() => {
    let _incomeData = map(groupedIncomes, (incomes, group) => {
      const incomeSum = sumBy(incomes, 'amount');
      return {
        name: group,
        value: incomeSum,
        transactions: incomes,
      };
    });
    let _paycheckData = map(groupedPaychecks, (paychecks, group) => {
      const paycheckSum = sumBy(paychecks, 'take_home');
      return {
        name: group,
        value: paycheckSum,
        transactions: paychecks,
      };
    });

    let _data = [..._incomeData, ..._paycheckData];
    _data = sortBy(_data, 'value').reverse();

    setIncomeData(_data);
  }, [groupedIncomes, groupedPaychecks]);

  useEffect(() => {
    const _incomeSum = incomeData.reduce((acc, curr) => acc + curr.value, 0);
    const _expenseSum = groupedExpenses.reduce(
      (acc, curr) => acc + curr.value,
      0
    );
    setIncomeSum(_incomeSum);
    setExpenseSum(_expenseSum);
    const _maxValue = Math.max(_incomeSum, _expenseSum);
    setMaxValue(_maxValue);
  }, [incomeData, groupedExpenses]);

  const expenseEndAngle = 360 - (360 * expenseSum) / maxValue;
  const incomeEndAngle = 360 - (360 * incomeSum) / maxValue;
  const height = 155;
  return (
    <>
      <Grid
        item
        xs={6}
        display='flex'
        justifyContent='center'
        sx={{ width: '100%', py: 1.25 }}
      >
        <ResponsiveContainer width='100%' height={height}>
          <PieChart width={200} height={height}>
            <Pie
              data={groupedExpenses}
              dataKey='value'
              paddingAngle={2}
              minAngle={10}
              innerRadius={50}
              outerRadius={70}
              cornerRadius={5}
              cx='50%'
              cy='50%'
              startAngle={360}
              endAngle={expenseEndAngle}
              activeIndex={activeExpenseIndex}
              activeShape={renderActiveShape}
              onPointerOver={(_, index) => {
                setActiveExpenseIndex(index);
              }}
            >
              {map(groupedExpenses, (group, idx) => {
                const lightColor = alpha(group.color, 0.5);
                return (
                  <Cell
                    key={`cell-${idx}`}
                    selectedFill={group.color}
                    fill={lightColor}
                    stroke={lightColor}
                  />
                );
              })}
            </Pie>
            <Pie
              data={incomeData}
              dataKey='value'
              paddingAngle={2}
              minAngle={10}
              innerRadius={25}
              outerRadius={45}
              cornerRadius={5}
              cx='50%'
              cy='50%'
              startAngle={360}
              endAngle={incomeEndAngle}
              activeIndex={activeIncomeIndex}
              activeShape={renderActiveShape}
              onPointerOver={(_, index) => {
                setActiveIncomeIndex(index);
              }}
            >
              {map(incomeData, (_, idx) => {
                const color = theme.palette.success.main;
                const lightColor = alpha(color, 0.5);

                return (
                  <Cell
                    key={`cell-${idx}`}
                    selectedFill={color}
                    fill={lightColor}
                    stroke={lightColor}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Grid>
      <Grid
        item
        xs={6}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: `${height}px` }}
      >
        {selectedExpense && (
          <Box sx={{ width: '100%', pr: 6 }}>
            <BoxFlexCenter>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(selectedExpense.value)}
              </Typography>
            </BoxFlexCenter>
            <Typography
              variant='h6'
              color='text.secondary'
              align='center'
              sx={{ color: selectedExpense.color }}
            >
              {selectedExpense.name}
            </Typography>
          </Box>
        )}
        {selectedIncome && (
          <Box sx={{ width: '100%', pr: 6 }}>
            <BoxFlexCenter>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(selectedIncome.value)}
              </Typography>
            </BoxFlexCenter>
            <Typography variant='h6' color='success.main' align='center'>
              {selectedIncome.name}
            </Typography>
          </Box>
        )}
      </Grid>
    </>
  );
}
