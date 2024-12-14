import React from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import ItemBox from '../../components/ItemBox';

export default function PurchasesStack(props) {
  const { purchases } = props;

  return purchases.map((purchase) => {
    return (
      <Grid item xs={12} key={purchase.purchase_id} mx={1}>
        <Card sx={{ width: '100%', py: 0.5 }}>
          <ItemBox item={purchase} />
        </Card>
      </Grid>
    );
  });
}
