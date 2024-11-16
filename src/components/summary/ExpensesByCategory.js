import React from 'react';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { Cell, PieChart, Pie } from 'recharts';
import { numberToCurrency } from '../../helpers/currency';

export default function ExpensesByCategory(props) {
  const { groupedExpenses, selected, setSelected } = props;
  const theme = useTheme();

  const selectCategory = (event) => {
    setSelected(
      groupedExpenses.find(
        (expenseGroup) => expenseGroup.id === event.target.id
      )
    );
  };

  if (groupedExpenses.length === 0) {
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
      <Box width={300} height={125}>
        <PieChart width={400} height={125}>
          <Pie
            data={groupedExpenses}
            dataKey='value'
            fill={theme.palette.green[400]}
            minAngle={4}
            outerRadius={60}
            labelLine
            cx='35%'
            cy='50%'
          >
            {groupedExpenses.map((expenseGroup, idx) => {
              return (
                <Cell
                  key={`cell-${idx}`}
                  fill={expenseGroup.color}
                  stroke={expenseGroup.color}
                  onMouseEnter={selectCategory}
                  onClick={selectCategory}
                />
              );
            })}
          </Pie>
        </PieChart>
      </Box>
      {selected && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            top: 80,
            left: -25,
            transform: 'translate(-40%, -40%)',
            width: '100%',
            maxWidth: '150px',
          }}
        >
          <Card raised>
            <ListItem disablePadding sx={{ pl: 1, pr: 2 }}>
              <ListItemIcon sx={{ minWidth: 'unset', pr: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: selected.color,
                    borderRadius: '5px',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={numberToCurrency.format(selected.value)}
                secondary={selected.name}
              />
            </ListItem>
          </Card>
        </Box>
      )}
    </Grid>
  );
}
