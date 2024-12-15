import React, { useState } from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Cell, PieChart, Pie, Sector } from 'recharts';

import { ASSETS } from '..';
import { _numberToCurrency, numberToCurrency } from '../../../helpers/currency';
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
    </g>
  );
};

export default function SubAccountPieChart(props) {
  const { type, data, sum, maxValue, showTitle = true } = props;
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const endAngle = 360 * (sum / maxValue);
  return (
    <Box
      width='100%'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <PieChart width={150} height={150}>
        <Pie
          data={data}
          dataKey='value'
          paddingAngle={2}
          minAngle={10}
          innerRadius={50}
          outerRadius={70}
          cx='50%'
          cy='50%'
          startAngle={0}
          endAngle={endAngle}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          cornerRadius={5}
          onPointerOver={(_, index) => {
            setActiveIndex(index);
          }}
        >
          {data.map((item, index) => {
            const color =
              type === ASSETS
                ? theme.palette.success.main
                : theme.palette.error.main;
            return (
              <Cell
                key={`cell-${index}`}
                selectedFill={color}
                fill={theme.palette.surface[300]}
                stroke={theme.palette.surface[300]}
              />
            );
          })}
        </Pie>
      </PieChart>
      {showTitle && (
        <Typography variant='h6' color='text.secondary' fontWeight='bold'>
          {type}
        </Typography>
      )}
      <BoxFlexCenter sx={{ justifyContent: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          $
        </Typography>
        <Typography variant='h5' color='white' fontWeight='bold'>
          {_numberToCurrency.format(sum)}
        </Typography>
      </BoxFlexCenter>
    </Box>
  );
}
