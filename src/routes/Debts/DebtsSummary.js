import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';

export default function DebtsSummary() {
  const allDebts = useSelector((state) => state.debts.data);

  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    setDebtSum(reduce(allDebts, (sum, debt) => sum + debt.amount, 0));
  }, [allDebts]);

  return (
    <Card raised sx={{ width: '75%' }}>
      <CardContent sx={{ p: 0, pb: '0px !important' }}>
        <List disablePadding>
          <ListItem>
            <ListItemText
              primary='total debt'
              primaryTypographyProps={{ fontWeight: 800, variant: 'h6' }}
            />
            <ListItemText
              primary={numberToCurrency.format(debtSum)}
              primaryTypographyProps={{
                align: 'right',
                fontWeight: 800,
                variant: 'h6',
              }}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
