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

export default function AssetsPieChart() {
  const assets = useSelector((state) => state.assets.data);
  const [assetData, setAssetData] = useState([]);

  useEffect(() => {
    if (assets.length) {
      let _assets = sortBy(cloneDeep(assets), 'value').reverse();
      remove(_assets, (asset) => asset.name === '3437 Beulah Rd Property');
      let data = groupBy(_assets, 'type');

      data = map(data, (items, group) => {
        return {
          name: group,
          amount: reduce(items, (acc, item) => acc + item.value, 0),
        };
      });
      setAssetData(data);
    }
  }, [assets]);

  return (
    <Grid item xs={6} justifyContent='center' display='flex' height={250}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart width={600} height={250}>
          <Pie
            dataKey='amount'
            isAnimationActive={false}
            data={assetData}
            cx='50%'
            cy='50%'
            outerRadius={80}
            fill='#82ca9d'
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
