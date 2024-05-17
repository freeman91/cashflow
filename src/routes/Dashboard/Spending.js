import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import { Cell, PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

import { useTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { numberToCurrency } from '../../helpers/currency';

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 15} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor='middle' fill={fill}>
        {numberToCurrency.format(payload.value)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export default function Spending({ month, setSelectedExpenses }) {
  const theme = useTheme();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    let expenses = filter(allExpenses, (expense) => {
      if (expense.pending) return false;

      const date = dayjs(expense.date);
      return date.year() === month.year() && date.month() === month.month();
    });

    let repayments = filter(allRepayments, (repayment) => {
      if (repayment.pending) return false;

      const date = dayjs(repayment.date);
      return date.year() === month.year() && date.month() === month.month();
    });
    repayments = map(repayments, (repayment) => {
      const principal = get(repayment, 'principal', 0);
      const interest = get(repayment, 'interest', 0);
      const escrow = get(repayment, 'escrow', 0);
      return { ...repayment, amount: principal + interest + escrow };
    });

    let groupedExpenses = groupBy([...expenses, ...repayments], 'category');
    let data = map(groupedExpenses, (expenses, group) => {
      return {
        name: group,
        value: reduce(expenses, (sum, expense) => sum + expense.amount, 0),
        expenses,
      };
    });

    if (data.length === 0) {
      data = [{ name: 'No expenses', value: 0.0000001 }];
    }

    setChartData(sortBy(data, 'value').reverse());
  }, [month, allExpenses, allRepayments]);

  useEffect(() => {
    const payload = chartData[activeIndex];
    let categoryExpenses = get(payload, 'expenses', []);
    setSelectedExpenses(sortBy(categoryExpenses, 'date'));
  }, [activeIndex, chartData, setSelectedExpenses]);

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
    <Card raised>
      <CardHeader
        title='spending'
        subheaderTypographyProps={{
          align: 'left',
        }}
        titleTypographyProps={{
          variant: 'h6',
          align: 'left',
          sx: { fontWeight: 800 },
        }}
        sx={{ pb: 0, pt: '4px' }}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      />
      <CardContent
        sx={{
          height: 250,
          p: 1,
          pt: 0,
          pb: '4px !important',
        }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart width={250} height={250}>
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
      </CardContent>
    </Card>
  );
}

export { renderActiveShape };
