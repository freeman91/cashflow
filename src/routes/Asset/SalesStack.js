import React from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import ItemBox from '../../components/ItemBox';

export default function SalesStack(props) {
  const { sales } = props;

  return sales.map((sale) => {
    return (
      <Grid item xs={12} key={sale.sale_id} mx={1}>
        <Card sx={{ width: '100%', py: 0.5 }}>
          <ItemBox item={sale} />
        </Card>
      </Grid>
    );
  });
}
