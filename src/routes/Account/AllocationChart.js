import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';

import useTheme from '@mui/material/styles/useTheme';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Cell, PieChart, Pie, Sector } from 'recharts';

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={4}
        textAnchor='middle'
        fill='grey'
        fontSize={12}
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
        fill={fill}
        cornerRadius={10}
      />
    </g>
  );
};

export default function AllocationChart(props) {
  const { type, sum, xs = 6 } = props;
  const theme = useTheme();

  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    if (type === 'assets') {
      const assetSum = reduce(assets, (acc, asset) => acc + asset.value, 0);
      setTotalSum(assetSum);
    } else if (type === 'debts') {
      const debtSum = reduce(debts, (acc, debt) => acc + debt.amount, 0);
      setTotalSum(debtSum);
    }
  }, [assets, debts, type]);

  const data = [
    { name: 'selected', value: sum },
    { name: 'rest', value: totalSum - sum },
  ];

  const color =
    type === 'assets' ? theme.palette.success.main : theme.palette.error.main;
  return (
    <Grid
      item
      xs={xs}
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
    >
      <PieChart width={75} height={75}>
        <Pie
          data={data}
          dataKey='value'
          paddingAngle={8}
          minAngle={10}
          innerRadius={25}
          outerRadius={35}
          cx='50%'
          cy='50%'
          startAngle={360}
          endAngle={0}
          activeIndex={0}
          activeShape={renderActiveShape}
          cornerRadius={10}
        >
          <Cell key='cell' fill={color} stroke={color} />
          <Cell
            key='cell-rest'
            fill={theme.palette.surface[300]}
            stroke={theme.palette.surface[300]}
          />
        </Pie>
      </PieChart>
      {xs === 3 && (
        <Typography variant='body1' color='text.secondary' align='center'>
          {type.replace(/s$/, '')}
        </Typography>
      )}
    </Grid>
  );
}
