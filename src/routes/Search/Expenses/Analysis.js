import React, { useEffect, useState } from 'react';

import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import { Cell, PieChart, Pie, ResponsiveContainer } from 'recharts';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../../helpers/currency';
import { renderActiveShape } from '../../Dashboard/Spending';

export default function ExpensesAnalysis(props) {
  const { expenses: allExpenses } = props;
  const theme = useTheme();

  const [expanded, setExpanded] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [repayments, setRepayments] = useState([]);

  const [principalSum, setPrincipleSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    setExpenses(filter(allExpenses, (expense) => expense._type === 'expense'));
  }, [allExpenses]);

  useEffect(() => {
    let _repayments = filter(
      allExpenses,
      (expense) => expense._type === 'repayment'
    );

    setRepayments(
      map(_repayments, (repayment) => {
        const principal = get(repayment, 'principal', 0);
        const interest = get(repayment, 'interest', 0);
        const escrow = get(repayment, 'escrow', 0);
        return { ...repayment, amount: principal + interest + escrow };
      })
    );
  }, [allExpenses]);

  useEffect(() => {
    setPrincipleSum(
      reduce(
        repayments,
        (sum, repayment) => sum + get(repayment, 'principal', 0),
        0
      )
    );
    setInterestSum(
      reduce(
        repayments,
        (sum, repayment) => sum + get(repayment, 'interest', 0),
        0
      )
    );
    setEscrowSum(
      reduce(
        repayments,
        (sum, repayment) => sum + get(repayment, 'escrow', 0),
        0
      )
    );
  }, [repayments]);

  useEffect(() => {
    let groupedExpenses = groupBy([...expenses, ...repayments], 'category');
    let data = map(groupedExpenses, (expenses, group) => {
      return {
        name: group,
        value: reduce(expenses, (sum, expense) => sum + expense.amount, 0),
        expenses: expenses,
      };
    });

    if (data.length === 0) {
      data = [{ name: 'No expenses', value: 0.0000001 }];
    }

    setChartData(sortBy(data, 'value').reverse());
  }, [expenses, repayments]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!hold) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % chartData.length);
      }
    }, 15000);

    // Clear the interval when the component is unmounted or the dependency changes
    return () => clearInterval(intervalId);
  }, [chartData, hold]);

  const onPieEnter = (data, index) => {
    if (!hold) setActiveIndex(index);
  };

  const onPieClick = (data, index) => {
    setHold((prevHold) => !prevHold);
  };

  return (
    <Card raised sx={{ mb: 1, height: expanded ? 400 : 40 }}>
      <CardContent sx={{ height: 300, p: 1, pt: 0, pb: '4px !important' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='body1'
            sx={{ mr: 1, cursor: 'pointer' }}
            onClick={() => setExpanded(!expanded)}
          >
            analysis
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        {expanded && (
          <>
            <Typography align='left'>
              principal: {numberToCurrency.format(principalSum)}
            </Typography>
            <Typography align='left'>
              interest: {numberToCurrency.format(interestSum)}
            </Typography>
            <Typography align='left'>
              escrow: {numberToCurrency.format(escrowSum)}
            </Typography>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart width={300} height={300}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx='50%'
                  cy='50%'
                  innerRadius={70}
                  stroke='#2F2F2F'
                  fill='#8884d8'
                  dataKey='value'
                  onMouseEnter={onPieEnter}
                  onClick={onPieClick}
                >
                  {chartData?.map((entry, index) => {
                    const color = theme.chartColors[entry.name] || '#0099FF';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
