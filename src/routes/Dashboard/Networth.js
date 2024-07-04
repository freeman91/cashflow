import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import { push } from 'redux-first-history';

export default function Networth() {
  const theme = useTheme();
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
    <Grid item xs={12} mx={2} mt='4px'>
      <Box
        onClick={() => dispatch(push('/networth'))}
        sx={{
          width: '100%',
          height: 75,
          background: `linear-gradient(0deg, ${theme.palette.surface[300]}, ${theme.palette.surface[500]})`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          mt: 2,
        }}
      >
        <BoxFlexColumn alignItems='flex-start'>
          <Typography variant='body2' color='grey.0'>
            networth
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(networth)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='center'>
          <BoxFlexCenter bgDark={true}>
            {differenceAttrs.symbol && (
              <Typography
                variant='body2'
                color={differenceAttrs.color}
                fontWeight='bold'
              >
                {differenceAttrs.symbol}
              </Typography>
            )}
            <Typography
              variant='body2'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              $
            </Typography>
            <Typography
              variant='body2'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              {_numberToCurrency.format(Math.abs(difference))}
            </Typography>
            <Typography
              variant='body2'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              &nbsp;
            </Typography>
            <Typography
              variant='body2'
              color={differenceAttrs.color}
              fontWeight='bold'
            >
              {`(${percentDifference.toFixed(2)}%)`}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Grid>
  );
}
