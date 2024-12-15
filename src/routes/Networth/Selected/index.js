import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../../store/user';
import { _numberToCurrency } from '../../../helpers/currency';
import CustomAppBar from '../../../components/CustomAppBar';
import PullToRefresh from '../../../components/PullToRefresh';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import CustomToggleButton from '../../../components/CustomToggleButton';
import SubAccountPieChart from '../../Accounts/Networth/SubAccountPieChart';
import ItemStack from './ItemStack';

const ASSETS = 'assets';
const DEBTS = 'debts';

export default function NetworthSelected() {
  const dispatch = useDispatch();
  const location = useLocation();

  const networths = useSelector((state) => state.networths.data);

  const [tab, setTab] = useState('assets');
  const [networth, setNetworth] = useState(null);
  const [prevNetworth, setPrevNetworth] = useState(null);
  const [difference, setDifference] = useState({
    value: 0,
    color: 'text.secondary',
    symbol: '',
    percent: 0,
  });
  const [groupedAssets, setGroupedAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [groupedDebts, setGroupedDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    const networthId = location.pathname.split('/').pop();
    let _networth = find(networths, { networth_id: networthId });
    if (_networth) {
      const prevNwDate = dayjs(
        `${_networth.year}-${_networth.month}-15`
      ).subtract(1, 'month');
      let _prevNetworth = find(networths, {
        year: prevNwDate.year(),
        month: prevNwDate.month() + 1,
      });
      setNetworth(_networth);
      if (_prevNetworth) {
        setPrevNetworth(_prevNetworth);
      }
    }
  }, [location.pathname, networths]);

  useEffect(() => {
    let _data = groupBy(networth?.assets, 'category');
    _data = map(_data, (items, category) => {
      const sum = reduce(
        items,
        (acc, item) => {
          return acc + item.value;
        },
        0
      );
      return {
        name: category,
        value: sum,
        items,
      };
    });
    _data = sortBy(_data, 'value').reverse();
    setGroupedAssets(_data);
    setAssetSum(reduce(_data, (acc, subaccount) => acc + subaccount.value, 0));
  }, [networth?.assets]);

  useEffect(() => {
    let _data = groupBy(networth?.debts, 'category');
    _data = map(_data, (items, category) => {
      const sum = reduce(items, (acc, item) => acc + item.value, 0);
      return { name: category, value: sum, items };
    });
    _data = sortBy(_data, 'value').reverse();
    setGroupedDebts(_data);
    setDebtSum(reduce(_data, (acc, subaccount) => acc + subaccount.value, 0));
  }, [networth?.debts]);

  useEffect(() => {
    const net = assetSum - debtSum;
    const prevAssetSum = prevNetworth?.assets.reduce(
      (acc, asset) => acc + asset.value,
      0
    );
    const prevDebtSum = prevNetworth?.debts.reduce(
      (acc, debt) => acc + debt.value,
      0
    );
    const prevNet = prevAssetSum - prevDebtSum;
    let percent = 0;

    if (net !== 0) {
      percent = ((net - prevNet) / prevNet) * 100;
    }
    setDifference({
      value: net - prevNet,
      color: net > 0 ? 'success.main' : 'error.main',
      symbol: net > 0 ? '+' : '-',
      percent,
    });
  }, [assetSum, debtSum, prevNetworth]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const maxValue = Math.max(assetSum, debtSum);
  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            networth
          </Typography>
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='center'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />

        <Grid item xs={12} mt={1}>
          <Stack direction='column' sx={{ cursor: 'pointer' }}>
            <Typography variant='h6' color='text.secondary' align='center'>
              {dayjs().format('MMMM YYYY')}
            </Typography>
            <BoxFlexCenter sx={{ justifyContent: 'center' }}>
              <Typography variant='h6' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h5' color='white' fontWeight='bold'>
                {_numberToCurrency.format(assetSum - debtSum)}
              </Typography>
            </BoxFlexCenter>
            <BoxFlexCenter sx={{ justifyContent: 'center' }}>
              {difference.symbol && (
                <Typography
                  variant='body1'
                  color={difference.color}
                  fontWeight='bold'
                >
                  {difference.symbol}
                </Typography>
              )}
              <Typography
                variant='body1'
                color={difference.color}
                fontWeight='bold'
              >
                $
              </Typography>
              <Typography
                variant='body1'
                color={difference.color}
                fontWeight='bold'
              >
                {_numberToCurrency.format(Math.abs(difference.value))}
              </Typography>
              <Typography
                variant='body1'
                color={difference.color}
                fontWeight='bold'
              >
                &nbsp;
              </Typography>
              <Typography
                variant='body1'
                color={difference.color}
                fontWeight='bold'
              >
                {`(${difference.percent.toFixed(2)}%)`}
              </Typography>
            </BoxFlexCenter>
          </Stack>
        </Grid>
        <Grid item xs={6} mt={1}>
          <SubAccountPieChart
            showTitle={false}
            type={ASSETS}
            data={groupedAssets}
            sum={assetSum}
            maxValue={maxValue}
          />
        </Grid>
        <Grid item xs={6} mt={1}>
          <SubAccountPieChart
            showTitle={false}
            type={DEBTS}
            data={groupedDebts}
            sum={debtSum}
            maxValue={maxValue}
          />
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center' mx={1} mt={1}>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
          >
            <CustomToggleButton value='assets'>assets</CustomToggleButton>
            <CustomToggleButton value='debts'>debts</CustomToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <ItemStack
          groupedItems={tab === 'assets' ? groupedAssets : groupedDebts}
        />
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
