import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
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
        cornerRadius={5}
      />
    </g>
  );
};

export default function IncomesByEmployerCategory(props) {
  const { groupedIncomes, groupedPaychecks } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

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

  const openTransactionsDialog = (category, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        id: category,
        attrs: transactions,
      })
    );
  };

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

  return (
    <Grid
      item
      xs={12}
      display='flex'
      justifyContent='space-between'
      sx={{ width: '100%', maxWidth: '400px !important' }}
    >
      <PieChart width={300} height={155}>
        <Pie
          data={chartData}
          dataKey='value'
          paddingAngle={2}
          minAngle={10}
          innerRadius={50}
          outerRadius={70}
          cornerRadius={5}
          cx='40%'
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
      {selected && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            transform: 'translate(-55%, 80%)',
            height: 'fit-content',
          }}
        >
          <ListItem
            disablePadding
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              openTransactionsDialog(selected.name, selected.transactions)
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
                    {_numberToCurrency.format(selected.value)}
                  </Typography>
                </BoxFlexCenter>
              }
              secondary={selected.name}
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
        </Box>
      )}
    </Grid>
  );
}
