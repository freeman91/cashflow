import React, { useEffect, useState } from 'react';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
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
    percent,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={5}
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
        cornerRadius={4}
      />
    </g>
  );
};

export default function IncomesByEmployerCategory(props) {
  const { groupedIncomes, groupedPaychecks, incomeTotal } = props;
  const theme = useTheme();

  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);

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

    setChartData(_data);
  }, [groupedIncomes, groupedPaychecks]);

  useEffect(() => {
    const _selected = chartData[activeIndex];
    setSelected(_selected);
  }, [activeIndex, chartData]);

  if (groupedIncomes.length === 0) {
    return (
      <Grid
        item
        xs={12}
        pt={'0 !important'}
        height={125}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography align='center' color='text.secondary'>
          no data
        </Typography>
      </Grid>
    );
  }

  const height = 125;
  return (
    <>
      <Grid
        item
        xs={6}
        display='flex'
        justifyContent='center'
        sx={{ width: '100%' }}
      >
        <ResponsiveContainer width='100%' height={height}>
          <PieChart width='100%' height={height}>
            <Pie
              data={chartData}
              dataKey='value'
              paddingAngle={2}
              minAngle={10}
              innerRadius={40}
              outerRadius={60}
              cornerRadius={4}
              cx='60%'
              cy='50%'
              startAngle={360}
              endAngle={0}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onPointerOver={(_, index) => {
                setActiveIndex(index);
              }}
            >
              {map(chartData, (group, idx) => {
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
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: `${height}px` }}
      >
        {selected && (
          <Box sx={{ width: '100%', pr: 6 }}>
            <BoxFlexCenter>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(selected.value)}
              </Typography>
            </BoxFlexCenter>
            <Typography variant='h6' color='text.secondary' align='center'>
              {selected.name}
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='center'
        sx={{ width: '100%' }}
      >
        <Typography
          variant='h6'
          color='text.secondary'
          align='center'
          fontWeight='bold'
          sx={{ mr: 2 }}
        >
          total
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(incomeTotal)}
          </Typography>
        </BoxFlexCenter>
      </Grid>
    </>
  );
}
