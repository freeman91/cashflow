import React from 'react';
import { useSelector } from 'react-redux';
import { get, reduce } from 'lodash';

import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';

function NetWorth() {
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const assetSum = reduce(
    assets,
    (acc, asset) => {
      return acc + get(asset, 'value', 0);
    },
    0
  );

  const debtSum = reduce(
    debts,
    (acc, debt) => {
      return acc + get(debt, 'value', 0);
    },
    0
  );

  return (
    <Card>
      <CardHeader
        title='Net Worth'
        sx={{ pb: 0 }}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <List dense sx={{ pt: 0 }}>
        <ListItem>
          <ListItemText
            primary={numberToCurrency.format(assetSum - debtSum)}
            primaryTypographyProps={{
              variant: 'h6',
              align: 'center',
              fontWeight: 700,
            }}
          />
        </ListItem>
        <Divider variant='middle' />
        <ListItem>
          <ListItemText
            primary='Assets'
            primaryTypographyProps={{
              align: 'left',
            }}
          />
          <ListItemText
            primary={numberToCurrency.format(assetSum)}
            primaryTypographyProps={{
              align: 'right',
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary='Debts'
            primaryTypographyProps={{
              align: 'left',
            }}
          />
          <ListItemText
            primary={numberToCurrency.format(debtSum)}
            primaryTypographyProps={{
              align: 'right',
            }}
          />
        </ListItem>
      </List>
    </Card>
  );
}

export default NetWorth;
