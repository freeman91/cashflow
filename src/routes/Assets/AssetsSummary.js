import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';

export default function AssetsSummary() {
  const allAssets = useSelector((state) => state.assets.data);

  const [assetSum, setAssetSum] = useState(0);

  useEffect(() => {
    setAssetSum(reduce(allAssets, (sum, asset) => sum + asset.value, 0));
  }, [allAssets]);

  return (
    <Card raised sx={{ width: '75%' }}>
      <CardContent sx={{ p: 0, pb: '0px !important' }}>
        <List disablePadding>
          <ListItem>
            <ListItemText
              primary='total value'
              primaryTypographyProps={{ fontWeight: 800, variant: 'h6' }}
            />
            <ListItemText
              primary={numberToCurrency.format(assetSum)}
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
