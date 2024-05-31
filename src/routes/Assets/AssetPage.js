import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import PurchasesTable from './PurchasesTable';
import SalesTable from './SalesTable';

export default function AssetPage(props) {
  const { asset } = props;

  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);

  const [purchases, setPurchases] = useState([]);
  const [purchaseSum, setPurchaseSum] = useState(0);
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(0);

  useEffect(() => {
    const assetPurchases = filter(allPurchases, { asset_id: asset.asset_id });
    setPurchaseSum(
      reduce(assetPurchases, (acc, purchase) => acc + purchase.value, 0)
    );
    setPurchases(sortBy(assetPurchases, 'value').reverse());
  }, [allPurchases, asset.asset_id]);

  useEffect(() => {
    const assetSales = filter(allSales, { asset_id: asset.asset_id });
    setSaleSum(reduce(assetSales, (acc, sale) => acc + sale.amount, 0));
    setSales(sortBy(assetSales, 'amount'));
  }, [allSales, asset.asset_id]);

  return (
    <>
      <Grid item xs={12}>
        <Card raised>
          <CardHeader
            disableTypography
            title={
              <Stack
                direction='row'
                justifyContent='space-between'
                sx={{ alignItems: 'center' }}
              >
                <Typography variant='h6' align='left' fontWeight='bold'>
                  {asset.name}
                </Typography>
                <Typography variant='h5' align='right'>
                  {numberToCurrency.format(asset.value)}
                </Typography>
              </Stack>
            }
            sx={{ p: 1, pt: '4px', pb: '4px' }}
          />
        </Card>
      </Grid>
      {purchases.length !== 0 && (
        <Grid item xs={12}>
          <Card raised>
            <CardHeader
              disableTypography
              title={
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant='body1' align='left' fontWeight='bold'>
                    purchases
                  </Typography>
                  {saleSum > 0 && (
                    <Typography variant='h6' align='right' fontWeight='bold'>
                      {numberToCurrency.format(purchaseSum)}
                    </Typography>
                  )}
                </Stack>
              }
              sx={{ p: 1, pt: '4px', pb: 0 }}
            />
            <CardContent
              sx={{
                p: 1,
                pt: 0,
                pb: `${purchases.length ? 0 : '4px'} !important`,
              }}
            >
              <PurchasesTable assetId={asset.asset_id} />
            </CardContent>
          </Card>
        </Grid>
      )}
      {sales.length !== 0 && (
        <Grid item xs={12}>
          <Card raised>
            <CardHeader
              disableTypography
              title={
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant='body1' align='left' fontWeight='bold'>
                    sales
                  </Typography>
                  {purchaseSum > 0 && (
                    <Typography variant='h6' align='right' fontWeight='bold'>
                      {numberToCurrency.format(saleSum)}
                    </Typography>
                  )}
                </Stack>
              }
              sx={{ p: 1, pt: '4px', pb: 0 }}
            />
            <CardContent
              sx={{ p: 1, pt: 0, pb: `${sales.length ? 0 : '4px'} !important` }}
            >
              <SalesTable assetId={asset.asset_id} />
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  );
}
