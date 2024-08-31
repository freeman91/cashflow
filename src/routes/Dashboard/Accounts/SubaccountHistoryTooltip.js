import React from 'react';
import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../../helpers/currency';

const CardMonthValue = (props) => {
  const { label, value } = props;
  return (
    <Card raised sx={{ px: 1 }}>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ fontWeight: 'bold', align: 'center' }}
      />
      <ListItemText
        primary={numberToCurrency.format(value)}
        primaryTypographyProps={{ align: 'center' }}
      />
    </Card>
  );
};

export default function SubaccountHistoryTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <CardMonthValue
        label={dayjs(Number(label)).format('MMMM YYYY')}
        value={value}
      />
    );
  }
  return null;
}
