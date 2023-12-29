import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';

export default function AccountsSummary() {
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    setAssetSum(reduce(allAssets, (sum, asset) => sum + asset.value, 0));
  }, [allAssets]);

  useEffect(() => {
    setDebtSum(reduce(allDebts, (sum, debt) => sum + debt.amount, 0));
  }, [allDebts]);

  return (
    <Card raised sx={{ width: '75%' }}>
      <CardContent sx={{ p: 0, pb: '0px !important' }}>
        <List disablePadding>
          <ListItem>
            <ListItemText
              primary='net'
              primaryTypographyProps={{ fontWeight: 800, variant: 'h6' }}
            />
            <ListItemText
              primary={numberToCurrency.format(assetSum - debtSum)}
              primaryTypographyProps={{
                align: 'right',
                fontWeight: 800,
                variant: 'h6',
              }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary='asset sum' />
            <ListItemText
              primary={numberToCurrency.format(assetSum)}
              primaryTypographyProps={{ align: 'right' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary='debt sum' />
            <ListItemText
              primary={numberToCurrency.format(debtSum)}
              primaryTypographyProps={{ align: 'right' }}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
