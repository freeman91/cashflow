import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';

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

export default function Spending({ month }) {
  const theme = useTheme();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

    let mortgagePayments = remove(repayments, (repayment) => {
      return repayment.escrow && repayment.escrow !== 0;
    });

    let groupedExpenses = groupBy(expenses, 'category');
    let data = map(groupedExpenses, (expenses, group) => {
      return {
        name: group,
        value: reduce(expenses, (sum, expense) => sum + expense.amount, 0),
      };
    });

    data.push({
      name: 'debt repayment',
      value: reduce(
        repayments,
        (sum, repayment) => sum + repayment.principal + repayment.interest,
        0
      ),
    });

    data.push({
      name: 'mortgage',
      value: reduce(
        mortgagePayments,
        (sum, repayment) =>
          sum + repayment.principal + repayment.interest + repayment.escrow,
        0
      ),
    });

    if (data.length === 0) {
      data = [{ name: 'No expenses', value: 0.0000001 }];
    }

    setChartData(data);
  }, [month, allExpenses, allRepayments]);

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  return (
    <Card raised>
      <CardHeader
        title='spending'
        titleTypographyProps={{
          variant: 'h6',
          align: 'left',
          sx: { fontWeight: 800 },
        }}
        sx={{ pb: 0, pt: 1 }}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ height: 400, p: 1, pt: 0, pb: '4px !important' }}>
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
            >
              {chartData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={theme.chartColors[index % theme.chartColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
