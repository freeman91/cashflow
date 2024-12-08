import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refresh } from '../../store/user';
import { openDialog } from '../../store/dialogs';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import AllocationChart from '../Account/AllocationChart';
import PurchasesStack from './PurchasesStack';
import SalesStack from './SalesStack';
import AssetChart from './AssetChart';
import CustomAppBar from '../../components/CustomAppBar';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import EditButton from '../../components/CustomAppBar/EditButton';

const PURCHASES = 'purchases';
const SALES = 'sales';
const HISTORY = 'history';

const CustomToggleButton = (props) => {
  return <ToggleButton {...props} sx={{ py: 0.5, color: 'text.secondary' }} />;
};

export default function Asset() {
  const dispatch = useDispatch();
  const location = useLocation();

  const assets = useSelector((state) => state.assets.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);

  const [asset, setAsset] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [purchaseSum, setPurchaseSum] = useState(0);
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(0);

  const [tab, setTab] = useState(PURCHASES);

  const onRefresh = async () => {
    dispatch(refresh());
  };
  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

  useEffect(() => {
    if (location.state?.assetId) {
      setAsset(assets.find((a) => a.asset_id === location.state.assetId));
    }
  }, [location.state?.assetId, assets]);

  useEffect(() => {
    const purchases = filter(allPurchases, { asset_id: asset?.asset_id });
    setPurchaseSum(
      reduce(purchases, (acc, purchase) => acc + purchase.amount, 0)
    );
    setPurchases(purchases);
    const sales = filter(allSales, { asset_id: asset?.asset_id });
    setSaleSum(reduce(sales, (acc, sale) => acc + sale.amount, 0));
    setSales(sales);
  }, [allPurchases, allSales, asset?.asset_id]);

  useEffect(() => {
    if (purchases.length === 0 && sales.length > 0) {
      setTab(SALES);
    } else if (purchases.length === 0 && sales.length === 0) {
      setTab(HISTORY);
    }
  }, [purchases, sales]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            {asset?.name}
          </Typography>
        }
        right={
          <EditButton
            handleClick={() =>
              dispatch(
                openDialog({ type: 'asset', mode: 'edit', attrs: asset })
              )
            }
          />
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: '42px' }}
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Box sx={{ width: '100%', mx: 1 }}>
            <Grid container>
              <Grid item xs={6}>
                <Stack direction='column'>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    align='center'
                  >
                    value
                  </Typography>
                  <BoxFlexCenter sx={{ justifyContent: 'center' }}>
                    <Typography variant='h6' color='text.secondary'>
                      $
                    </Typography>
                    <Typography variant='h5' color='white' fontWeight='bold'>
                      {_numberToCurrency.format(asset?.value)}
                    </Typography>
                  </BoxFlexCenter>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      align='center'
                    >
                      allocation
                    </Typography>
                  </Grid>
                  <AllocationChart type={'assets'} sum={asset?.value} xs={12} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {purchaseSum > 0 && (
          <Grid item xs={4}>
            <Typography variant='body1' color='text.secondary' align='center'>
              total purchases
            </Typography>
            <Typography variant='h6' fontWeight='bold' align='center'>
              {numberToCurrency.format(purchaseSum)}
            </Typography>
          </Grid>
        )}
        {saleSum > 0 && (
          <Grid item xs={4}>
            <Typography variant='body1' color='text.secondary' align='center'>
              total sales
            </Typography>
            <Typography variant='h6' fontWeight='bold' align='center'>
              {numberToCurrency.format(saleSum)}
            </Typography>
          </Grid>
        )}
        <Grid item xs={4}>
          <Typography variant='body1' color='text.secondary' align='center'>
            total equity
          </Typography>
          <Typography variant='h6' fontWeight='bold' align='center'>
            {numberToCurrency.format(saleSum - purchaseSum + asset?.value)}
          </Typography>
        </Grid>

        <Grid item xs={12} display='flex' justifyContent='center'>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
            sx={{ mt: 1, px: 1 }}
          >
            {purchases.length > 0 && (
              <CustomToggleButton value={PURCHASES}>
                {PURCHASES}
              </CustomToggleButton>
            )}
            {sales.length > 0 && (
              <CustomToggleButton value={SALES}>{SALES}</CustomToggleButton>
            )}
            <CustomToggleButton value={HISTORY}>{HISTORY}</CustomToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12} display='flex' justifyContent='center'>
          {tab === PURCHASES && <PurchasesStack assetId={asset?.asset_id} />}
          {tab === SALES && <SalesStack assetId={asset?.asset_id} />}
          {tab === HISTORY && <AssetChart asset={asset} />}
        </Grid>
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
