import React from 'react';
import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../../helpers/currency';

const CardMonthValue = (props) => {
  const { label, value } = props;
  return (
    <Card sx={{ px: 1, minWidth: 100 }}>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ align: 'center', color: 'text.secondary' }}
      />
      <ListItemText
        primary={numberToCurrency.format(value)}
        primaryTypographyProps={{ align: 'center', fontWeight: 'bold' }}
      />
    </Card>
  );
};

export default function SubaccountHistoryTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <CardMonthValue
        label={dayjs.unix(Number(label)).format('MMMM YYYY')}
        value={value}
      />
    );
  }
  return null;
}
