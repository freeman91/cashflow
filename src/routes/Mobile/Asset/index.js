import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../../store/user';
import { _numberToCurrency, numberToCurrency } from '../../../helpers/currency';
import AllocationChart from '../Account/AllocationChart';
import PurchasesStack from './PurchasesStack';
import SalesStack from './SalesStack';
import AssetChart from './AssetChart';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import CustomToggleButton from '../../../components/CustomToggleButton';
import CustomAppBar from '../../../components/CustomAppBar';
import PullToRefresh from '../../../components/PullToRefresh';
import TransactionsGridStack from '../../../components/TransactionsGridStack';
import PageMoreVertButton from '../../../components/CustomAppBar/PageMoreVertButton';

const PURCHASES = 'purchases';
const SALES = 'sales';
const TRANSACTIONS = 'transactions';
const HISTORY = 'history';

export default function Asset() {
  const dispatch = useDispatch();
  const location = useLocation();

  const assets = useSelector((state) => state.assets.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [asset, setAsset] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [purchaseSum, setPurchaseSum] = useState(0);
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [tab, setTab] = useState(PURCHASES);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    if (location.state?.assetId) {
      const _asset = assets.find((a) => a.asset_id === location.state.assetId);
      if (_asset) {
        setAsset(_asset);
      }
    }
  }, [location.state?.assetId, assets]);

  useEffect(() => {
    if (purchases.length > 0) {
      setTab(PURCHASES);
    } else if (sales.length > 0) {
      setTab(SALES);
    } else if (transactions.length > 0) {
      setTab(TRANSACTIONS);
    } else {
      setTab(HISTORY);
    }
  }, [purchases.length, sales.length, transactions.length]);

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
    let _transactions = [];
    if (asset?.can_pay_from) {
      const expenses = filter(allExpenses, { payment_from_id: asset.asset_id });
      const repayments = filter(allRepayments, {
        payment_from_id: asset.asset_id,
      });
      _transactions = [...expenses, ...repayments];
    }

    if (asset?.can_deposit_to) {
      const incomes = filter(allIncomes, { deposit_to_id: asset.asset_id });
      const paychecks = filter(allPaychecks, (paycheck) => {
        return (
          paycheck.deposit_to_id === asset.asset_id && paycheck.date != null
        );
      });
      _transactions = [..._transactions, ...incomes, ...paychecks];
    }

    setTransactions(sortBy(_transactions, 'date').reverse());
  }, [asset, allExpenses, allRepayments, allIncomes, allPaychecks]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  if (!asset) return null;
  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            {asset?.name}
          </Typography>
        }
        right={<PageMoreVertButton item={asset} />}
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />
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
            {transactions.length > 0 && (
              <CustomToggleButton value={TRANSACTIONS}>
                {TRANSACTIONS}
              </CustomToggleButton>
            )}
            <CustomToggleButton value={HISTORY}>{HISTORY}</CustomToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {tab === PURCHASES && <PurchasesStack purchases={purchases} />}
        {tab === SALES && <SalesStack sales={sales} />}
        {tab === TRANSACTIONS && (
          <TransactionsGridStack transactions={transactions} />
        )}
        {tab === HISTORY && <AssetChart asset={asset} />}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
