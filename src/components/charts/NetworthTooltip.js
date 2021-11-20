import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, Divider, Typography } from '@mui/material';

import { get, map } from 'lodash';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { numberToCurrency } from '../../helpers/currency';
import { months } from '../../helpers/monthNames';

dayjs.extend(timezone);

export const NetworthTooltip = ({ active, payload, label }) => {
  let resources = map(payload, (resource) => {
    let name = get(resource, 'name');
    if (name.startsWith('asset')) {
      name = 'Assets';
    } else if (name.startsWith('debt')) {
      name = 'Debts';
    } else {
      name = 'Net Worth';
    }

    if (get(resource, 'value') !== 0) {
      return (
        <div
          key={`${get(resource, 'payload.month')}-${uuidv4()}`}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Typography
            align='left'
            style={{ color: get(resource, 'color'), width: '12rem' }}
          >
            {name}
          </Typography>
          <Typography align='right' style={{ color: get(resource, 'color') }}>
            {numberToCurrency.format(get(resource, 'value'))}
          </Typography>
        </div>
      );
    } else {
      return null;
    }
  });

  if (active && payload && payload.length) {
    let [month, year] = label.split('-');

    return (
      <Card variant='outlined'>
        <CardContent sx={{ bgcolor: 'grey' }}>
          <Typography gutterBottom>{`${
            months[Number(month) - 1]
          } ${year}`}</Typography>
          <Divider />
          {resources}
        </CardContent>
      </Card>
    );
  }

  return null;
};
