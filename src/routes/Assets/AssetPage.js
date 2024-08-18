import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import PurchasesStack from './PurchasesStack';
import SalesStack from './SalesStack';
import ItemBox from '../../components/ItemBox';
import AssetChart from '../Networth/AssetChart';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import DataBox from '../../components/DataBox';

export default function AssetPage(props) {
  const { asset } = props;

  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);

  const [tabIdx, setTabIdx] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [purchaseSum, setPurchaseSum] = useState(0);
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(0);

  useEffect(() => {
    if (purchases.length > 0) {
      setTabIdx('purchases');
    } else if (sales.length > 0) {
      setTabIdx('sales');
    } else {
      setTabIdx('history');
    }
  }, [purchases.length, sales.length]);

  useEffect(() => {
    const assetPurchases = filter(allPurchases, { asset_id: asset.asset_id });
    setPurchaseSum(
      reduce(assetPurchases, (acc, purchase) => acc + purchase.amount, 0)
    );
    setPurchases(sortBy(assetPurchases, 'amount').reverse());
  }, [allPurchases, asset.asset_id]);

  useEffect(() => {
    const assetSales = filter(allSales, { asset_id: asset.asset_id });
    setSaleSum(reduce(assetSales, (acc, sale) => acc + sale.amount, 0));
    setSales(sortBy(assetSales, 'amount'));
  }, [allSales, asset.asset_id]);

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <Grid item xs={12} mx={1}>
        <Card raised sx={{ borderRadius: '10px', py: 1 }}>
          <ItemBox item={asset} />
        </Card>
      </Grid>
      {tabIdx !== null && (
        <Grid item xs={12}>
          <StyledTabs value={tabIdx} onChange={handleChange} centered>
            {purchases.length > 0 && (
              <StyledTab
                label='purchases'
                value='purchases'
                sx={{ width: '25%' }}
              />
            )}
            {sales.length > 0 && (
              <StyledTab label='sales' value='sales' sx={{ width: '25%' }} />
            )}
            <StyledTab label='history' value='history' sx={{ width: '25%' }} />
          </StyledTabs>
        </Grid>
      )}
      {tabIdx === 'purchases' && purchases.length !== 0 && (
        <>
          <Grid item xs={12} mx={2} pt='2px !important'>
            <DataBox label='invested' value={purchaseSum} />
          </Grid>
          <Grid item xs={12} mx={1} mb={10} pt={'0 !important'}>
            <PurchasesStack assetId={asset.asset_id} />
          </Grid>
        </>
      )}
      {tabIdx === 'sales' && sales.length !== 0 && (
        <>
          <Grid item xs={12} mx={1} pt={'2px !important'}>
            {sales.length > 1 && (
              <Grid item xs={12} mx={1} pt='2px !important'>
                <BoxFlexCenter>
                  <Typography variant='h5' color='text.secondary'>
                    $
                  </Typography>
                  <Typography variant='h5' color='white' fontWeight='bold'>
                    {_numberToCurrency.format(saleSum)}
                  </Typography>
                </BoxFlexCenter>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} mx={1} mb={10} pt={'2px !important'}>
            <SalesStack assetId={asset.asset_id} />
          </Grid>
        </>
      )}
      {tabIdx === 'history' && (
        <Grid item xs={12} mx={1} pt={'2px !important'}>
          <AssetChart asset={asset} />
        </Grid>
      )}
    </>
  );
}
