import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

import { numberToCurrency } from '../../../helpers/currency';

function CustomTooltip({ active, payload, expenseTotal }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <List
        disablePadding
        sx={{
          bgcolor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[24],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          py: 0.5,
        }}
      >
        <ListItem
          sx={{
            display: 'flex',
            gap: 1,
            px: 1,
            py: 0,
          }}
        >
          <Box sx={{ height: 10, width: 10, bgcolor: item.payload.fill }} />
          <ListItemText primary={item.name} />
        </ListItem>
        <ListItem sx={{ display: 'flex', gap: 1, px: 1, py: 0 }}>
          <ListItemText secondary='amount' />
          <ListItemText
            primary={numberToCurrency.format(item.value)}
            slotProps={{ primary: { align: 'right' } }}
          />
        </ListItem>
        <ListItem sx={{ display: 'flex', gap: 1, px: 1, py: 0 }}>
          <ListItemText secondary='percent' />
          <ListItemText
            primary={`${((item.value / expenseTotal) * 100).toFixed(2)}%`}
            slotProps={{ primary: { align: 'right' } }}
          />
        </ListItem>
      </List>
    );
  }
  return null;
}

export default function MerchantsPieChart(props) {
  const { chartData, expenseTotal } = props;

  return (
    <Grid size={{ xs: 12 }}>
      <Box sx={{ width: '100%' }}>
        <ResponsiveContainer
          width='100%'
          height={300}
          style={{ '& .rechartsSurface': { overflow: 'visible' } }}
        >
          <PieChart width='100%' height={300} data={chartData}>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              labelLine={false}
              minAngle={2}
            >
              {chartData.map(({ color }, idx) => (
                <Cell key={`cell-${idx}`} fill={color} stroke={color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip expenseTotal={expenseTotal} />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
