import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Grid from '@mui/material/Grid';

import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import PurchasesStack from './PurchasesStack';
import SalesStack from './SalesStack';
import ItemBox from '../../components/ItemBox';
import DataBox from '../../components/DataBox';

export default function AssetPage(props) {
  const { asset } = props;

  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);

  const [tabIdx, setTabIdx] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [purchaseSum, setPurchaseSum] = useState(0);
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(0);

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
        <ItemBox item={asset} />
      </Grid>
      <Grid item xs={12}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='purchases' sx={{ width: '35%' }} />
          <StyledTab label='sales' sx={{ width: '35%' }} />
        </StyledTabs>
      </Grid>
      {tabIdx === 0 && purchases.length !== 0 && (
        <>
          <Grid item xs={12} mx={1} pt={'2px !important'}>
            <DataBox label='total' value={purchaseSum} />
          </Grid>
          <Grid item xs={12} mx={1} mb={10} pt={'0 !important'}>
            <PurchasesStack assetId={asset.asset_id} />
          </Grid>
        </>
      )}
      {tabIdx === 1 && sales.length !== 0 && (
        <>
          <Grid item xs={12} mx={1} pt={'0 !important'}>
            <DataBox label='total' value={saleSum} />
          </Grid>
          <Grid item xs={12} mx={1} mb={10} pt={'2px !important'}>
            <SalesStack assetId={asset.asset_id} />
          </Grid>
        </>
      )}
    </>
  );
}
