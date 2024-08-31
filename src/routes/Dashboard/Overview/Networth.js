import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import BoxFlexColumn from '../../../components/BoxFlexColumn';

export default function Networth() {
  const dispatch = useDispatch();

  const networths = useSelector((state) => state.networths.data);
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [date] = useState(dayjs().hour(12).minute(0));
  const [networth, setNetworth] = useState(0);
  const [difference, setDifference] = useState(0);

  useEffect(() => {
    const assetSum = reduce(assets, (sum, asset) => sum + asset.value, 0);
    const debtSum = reduce(debts, (sum, debt) => sum + debt.amount, 0);
    setNetworth(assetSum - debtSum);
  }, [assets, debts]);

  useEffect(() => {
    const lastMonth = date.subtract(1, 'month');
    const lastMonthNetworth = find(networths, {
      year: lastMonth.year(),
      month: lastMonth.month() + 1,
    });

    if (!lastMonthNetworth) {
      return;
    }

    const assetSum = reduce(
      lastMonthNetworth.assets,
      (sum, asset) => sum + asset.value,
      0
    );
    const debtSum = reduce(
      lastMonthNetworth.debts,
      (sum, debt) => sum + debt.value,
      0
    );
    const net = assetSum - debtSum;
    setDifference(networth - net);
  }, [networths, date, networth]);

  const differenceAttrs = (() => {
    if (difference === 0) {
      return { color: 'grey.10', symbol: null };
    }
    if (difference > 0) {
      return { color: 'green.400', symbol: '+' };
    }
    return { color: 'red.400', symbol: '-' };
  })();

  const percentDifference = (() => {
    if (networth === 0) {
      return 0;
    }
    return (difference / networth) * 100;
  })();

  return (
    <Grid item xs={12} mx={1}>
      <Card
        raised
        onClick={() => dispatch(push('/dashboard/networth'))}
        sx={{
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1,
          py: 1,
          px: 2,
        }}
      >
        <BoxFlexColumn alignItems='flex-start'>
          <Typography variant='body2' color='text.secondary'>
            networth
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(networth)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='center'>
          <BoxFlexCenter>
            {differenceAttrs.symbol && (
              <Typography
                variant='body1'
                color={differenceAttrs.color}
                fontWeight='bold'
              >
                {differenceAttrs.symbol}
              </Typography>
            )}
            <Typography
              variant='body1'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              $
            </Typography>
            <Typography
              variant='body1'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              {_numberToCurrency.format(Math.abs(difference))}
            </Typography>
            <Typography
              variant='body1'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              &nbsp;
            </Typography>
            <Typography
              variant='body1'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              {`(${percentDifference.toFixed(2)}%)`}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Card>
    </Grid>
  );
}
