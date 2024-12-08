import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Cell, PieChart, Pie, Sector } from 'recharts';
import { _numberToCurrency, numberToCurrency } from '../../../helpers/currency';
import { ASSETS } from '..';
import BoxFlexCenter from '../../../components/BoxFlexCenter';

const renderActiveShape = (props) => {
  const {
    name,
    value,
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    selectedFill,
    percent,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-12}
        textAnchor='middle'
        fill={selectedFill}
        fontSize={16}
        fontWeight={700}
      >
        {name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor='middle'
        fill={selectedFill}
        fontSize={16}
        fontWeight={700}
      >
        {numberToCurrency.format(value)}
      </text>
      <text
        x={cx}
        y={cy}
        dy={26}
        textAnchor='middle'
        fill={selectedFill}
        fontSize={16}
        fontWeight={700}
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
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

export default function SubAccountPieChart(props) {
  const { type } = props;
  const theme = useTheme();

  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let _data = [];
    if (type === ASSETS) {
      _data = groupBy(assets, 'category');
    } else {
      _data = groupBy(debts, 'category');
    }
    _data = map(_data, (subaccounts, category) => {
      const sum = reduce(
        subaccounts,
        (acc, subaccount) => {
          if (type === ASSETS) {
            return acc + subaccount.value;
          } else {
            return acc + subaccount.amount;
          }
        },
        0
      );
      return {
        name: category,
        value: sum,
      };
    });
    _data = sortBy(_data, 'value').reverse();
    setSum(reduce(_data, (acc, subaccount) => acc + subaccount.value, 0));
    setChartData(_data);
  }, [assets, debts, type]);

  return (
    <Box
      width='100%'
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <PieChart width={150} height={150}>
        <Pie
          data={chartData}
          dataKey='value'
          paddingAngle={2}
          minAngle={10}
          innerRadius={50}
          outerRadius={70}
          cx='50%'
          cy='50%'
          startAngle={360}
          endAngle={0}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          cornerRadius={5}
          onPointerOver={(_, index) => {
            setActiveIndex(index);
          }}
        >
          {chartData.map((entry, index) => {
            const selectedColor = Object.values(theme.chartColors)[index];
            return (
              <Cell
                key={`cell-${index}`}
                fill={theme.palette.surface[300]}
                selectedFill={selectedColor}
                stroke={theme.palette.surface[300]}
              />
            );
          })}
        </Pie>
      </PieChart>
      <Stack direction='column'>
        <Typography variant='body1' color='text.secondary' align='center'>
          total
        </Typography>
        <BoxFlexCenter sx={{ justifyContent: 'center' }}>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(sum)}
          </Typography>
        </BoxFlexCenter>
      </Stack>
    </Box>
  );
}
