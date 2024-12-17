import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';

import { alpha, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { Cell, PieChart, Pie, Sector } from 'recharts';

import { openDialog } from '../../store/dialogs';
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
  const dispatch = useDispatch();

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

  const openTransactionsDialog = (category, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        id: category,
        attrs: transactions,
      })
    );
  };

  // if (groupedExpenses.length === 0) {
  //   return (
  //     <Grid
  //       item
  //       xs={12}
  //       pt={'0 !important'}
  //       height={125}
  //       display='flex'
  //       alignItems='center'
  //       justifyContent='center'
  //     >
  //       <Typography align='center' color='text.secondary'>
  //         no data
  //       </Typography>
  //     </Grid>
  //   );
  // }

  const expenseEndAngle = 360 - (360 * expenseSum) / maxValue;
  const incomeEndAngle = 360 - (360 * incomeSum) / maxValue;
  return (
    <Grid
      item
      xs={12}
      display='flex'
      justifyContent='space-between'
      sx={{ width: '100%' }}
    >
      <PieChart width={200} height={157}>
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
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          transform: 'translate(-20%, 25%)',
          height: 'fit-content',
        }}
      >
        {selectedExpense && (
          <ListItem
            disablePadding
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              openTransactionsDialog(
                selectedExpense.name,
                selectedExpense.expenses
              )
            }
          >
            <ListItemIcon
              sx={{
                minWidth: 'unset',
                mr: 2,
                backgroundColor: selectedExpense.color,
                borderRadius: '5px',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuIcon
                sx={{
                  width: 20,
                  height: 20,
                  color: 'surface.100',
                }}
              />
            </ListItemIcon>
            <ListItemText
              sx={{ width: '100px' }}
              primary={
                <BoxFlexCenter sx={{ justifyContent: 'flex-start' }}>
                  <Typography variant='body2' color='text.secondary'>
                    $
                  </Typography>
                  <Typography variant='body1' color='white' fontWeight='bold'>
                    {_numberToCurrency.format(selectedExpense.value)}
                  </Typography>
                </BoxFlexCenter>
              }
              secondary={selectedExpense.name}
              secondaryTypographyProps={{ align: 'left' }}
            />
          </ListItem>
        )}
        {selectedIncome && (
          <ListItem
            disablePadding
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              openTransactionsDialog(
                selectedIncome.name,
                selectedIncome.transactions
              )
            }
          >
            <ListItemIcon
              sx={{
                minWidth: 'unset',
                mr: 2,
                backgroundColor: 'success.main',
                borderRadius: '5px',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuIcon
                sx={{
                  width: 20,
                  height: 20,
                  color: 'surface.100',
                }}
              />
            </ListItemIcon>
            <ListItemText
              sx={{ width: '100px' }}
              primary={
                <BoxFlexCenter sx={{ justifyContent: 'flex-start' }}>
                  <Typography variant='body2' color='text.secondary'>
                    $
                  </Typography>
                  <Typography variant='body1' color='white' fontWeight='bold'>
                    {_numberToCurrency.format(selectedIncome.value)}
                  </Typography>
                </BoxFlexCenter>
              }
              secondary={selectedIncome.name}
              secondaryTypographyProps={{
                align: 'left',
                sx: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                },
              }}
            />
          </ListItem>
        )}
      </Box>
    </Grid>
  );
}
