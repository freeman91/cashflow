import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ResponsiveContainer, Tooltip, PieChart, Pie } from 'recharts';
import { cloneDeep, groupBy, map, reduce, remove, sortBy } from 'lodash';

import { numberToCurrency } from '../../helpers/currency';

const CustomTooltip = (props) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    return (
      <Card raised>
        <CardContent sx={{ width: '20rem', p: 1, pb: '4px !important' }}>
          <List disablePadding>
            {map(payload, (entry) => {
              return (
                <ListItem key={entry.name} disablePadding>
                  <ListItemText primary={entry.name} />
                  <ListItemText
                    primary={numberToCurrency.format(entry.value)}
                    primaryTypographyProps={{ align: 'right' }}
                  />
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default function DebtsPieChart() {
  const debts = useSelector((state) => state.debts.data);
  const [debtData, setDebtData] = useState([]);

  useEffect(() => {
    if (debts.length) {
      let _debts = sortBy(cloneDeep(debts), 'value').reverse();
      remove(_debts, (debt) => debt.name === 'Mortgage');
      remove(_debts, (debt) => debt.value === 0);
      let data = groupBy(_debts, 'name');

      data = map(data, (items, group) => {
        return {
          name: group,
          amount: reduce(items, (acc, item) => acc + item.value, 0),
        };
      });
      setDebtData(data);
    }
  }, [debts]);

  return (
    <Grid item xs={6} justifyContent='center' display='flex' height={250}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart width={600} height={250}>
          <Pie
            dataKey='amount'
            isAnimationActive={false}
            data={debtData}
            cx='50%'
            cy='50%'
            outerRadius={80}
            fill='#8884d8'
            label={(props) => {
              return props.name;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Grid>
  );
}
