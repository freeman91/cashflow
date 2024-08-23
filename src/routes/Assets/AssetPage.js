import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { findId } from '../../helpers/transactions';
import { _numberToCurrency } from '../../helpers/currency';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import PurchasesStack from './PurchasesStack';
import SalesStack from './SalesStack';
import ItemBox from '../../components/ItemBox';
import AssetChart from '../Networth/AssetChart';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import DataBox from '../../components/DataBox';
import TransactionBox from '../../components/TransactionBox';

export default function AssetPage(props) {
  const { asset } = props;

  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [tabIdx, setTabIdx] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [purchaseSum, setPurchaseSum] = useState(0);
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (purchases.length > 0) {
      setTabIdx('purchases');
    } else if (sales.length > 0) {
      setTabIdx('sales');
    } else if (transactions.length > 0) {
      setTabIdx('transactions');
    } else {
      setTabIdx('history');
    }
  }, [purchases.length, sales.length, transactions.length]);

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

  useEffect(() => {
    let _transactions = [];
    if (asset.can_pay_from) {
      const expenses = filter(allExpenses, { payment_from_id: asset.asset_id });
      const repayments = filter(allRepayments, {
        payment_from_id: asset.asset_id,
      });
      _transactions = [...expenses, ...repayments];
    }

    if (asset.can_deposit_to) {
      const incomes = filter(allIncomes, { deposit_to_id: asset.asset_id });
      const paychecks = filter(allPaychecks, { deposit_to_id: asset.asset_id });
      _transactions = [..._transactions, ...incomes, ...paychecks];
    }

    setTransactions(sortBy(_transactions, 'date').reverse());
  }, [asset, allExpenses, allRepayments, allIncomes, allPaychecks]);

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
        <Grid item xs={12} mx={2}>
          <StyledTabs
            value={tabIdx}
            onChange={handleChange}
            variant='fullWidth'
          >
            {purchases.length > 0 && (
              <StyledTab label='purchases' value='purchases' />
            )}
            {sales.length > 0 && <StyledTab label='sales' value='sales' />}
            {transactions.length > 0 && (
              <StyledTab label='transactions' value='transactions' />
            )}
            <StyledTab label='history' value='history' />
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
      {tabIdx === 'transactions' && transactions.length !== 0 && (
        <Grid item xs={12} mx={1} mb={10} pt={'2px !important'}>
          <Card raised>
            <Stack spacing={1} direction='column' pt={1} pb={1}>
              {map(transactions, (transaction, idx) => {
                const key = findId(transaction);
                return (
                  <React.Fragment key={key}>
                    <TransactionBox transaction={transaction} />
                    {idx < transactions.length - 1 && (
                      <Divider sx={{ mx: '8px !important' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        </Grid>
      )}
      {tabIdx === 'history' && (
        <Grid item xs={12} mx={1} pt={'2px !important'}>
          <AssetChart asset={asset} />
        </Grid>
      )}
    </>
  );
}
