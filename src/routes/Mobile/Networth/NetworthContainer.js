import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import SubAccountPieChart from '../Accounts/Networth/SubAccountPieChart';

const ASSETS = 'assets';
const DEBTS = 'debts';

export default function NetworthContainer(props) {
  const { networthId } = props;
  const dispatch = useDispatch();

  const networths = useSelector((state) => state.networths.data);

  const [networth, setNetworth] = useState(null);
  const [groupedAssets, setGroupedAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [groupedDebts, setGroupedDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    if (networthId) {
      setNetworth(find(networths, { networth_id: networthId }));
    } else {
      const today = dayjs();
      let _networth = find(networths, {
        year: today.year(),
        month: today.month() + 1,
      });
      if (_networth) {
        setNetworth(_networth);
      } else {
        setNetworth(null);
      }
    }
  }, [networths, networthId]);

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
      return { name: category, value: sum };
    });
    _data = sortBy(_data, 'value').reverse();
    setGroupedDebts(_data);
    setDebtSum(reduce(_data, (acc, subaccount) => acc + subaccount.value, 0));
  }, [networth?.debts]);

  const handleClick = () => {
    dispatch(push(`/networth/${networth.networth_id}`));
  };

  if (!networth) return null;
  const net = assetSum - debtSum;
  const maxValue = Math.max(assetSum, debtSum);
  return (
    <Grid item xs={12} display='flex' justifyContent='center' mt={1} mx={1}>
      <Card sx={{ py: 1 }}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={1}
        >
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Box sx={{ pl: 2 }}>
              <Typography variant='body1' align='left' color='text.secondary'>
                {`${dayjs(networth.date).format('MMMM YYYY')}`}
              </Typography>
              <BoxFlexCenter>
                <Typography variant='h6' color='text.secondary'>
                  $
                </Typography>
                <Typography variant='h5' color='white' fontWeight='bold'>
                  {_numberToCurrency.format(net)}
                </Typography>
              </BoxFlexCenter>
            </Box>
            <Box>
              <IconButton
                size='large'
                color='info'
                onClick={handleClick}
                sx={{ p: 0.75, mr: 1 }}
              >
                <ChevronRightIcon sx={{ width: '30px', height: '30px' }} />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} mt={1}>
            <SubAccountPieChart
              type={ASSETS}
              data={groupedAssets}
              sum={assetSum}
              maxValue={maxValue}
            />
          </Grid>
          <Grid item xs={6} mt={1}>
            <SubAccountPieChart
              type={DEBTS}
              data={groupedDebts}
              sum={debtSum}
              maxValue={maxValue}
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
