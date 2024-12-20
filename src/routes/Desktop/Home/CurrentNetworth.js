import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BoxFlexCenter from '../../components/BoxFlexCenter';
import { _numberToCurrency } from '../../helpers/currency';

export default function CurrentNetworth(props) {
  const { textSize = 'large', align = 'center', title = 'networth' } = props;

  const dispatch = useDispatch();
  const networths = useSelector((state) => state.networths.data);
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [networth, setNetworth] = useState(0);
  const [difference, setDifference] = useState(0);

  useEffect(() => {
    const assetSum = reduce(assets, (sum, asset) => sum + asset.value, 0);
    const debtSum = reduce(debts, (sum, debt) => sum + debt.amount, 0);
    setNetworth(assetSum - debtSum);
  }, [assets, debts]);

  useEffect(() => {
    const today = dayjs();
    const lastMonth = today.subtract(1, 'month');
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
  }, [networths, networth]);

  const differenceAttrs = (() => {
    if (difference === 0) {
      return { color: 'text.secondary', symbol: null };
    }
    if (difference > 0) {
      return { color: 'success.main', symbol: '+' };
    }
    return { color: 'error.main', symbol: '-' };
  })();

  const percentDifference = (() => {
    if (networth === 0) {
      return 0;
    }
    return (difference / networth) * 100;
  })();

  const handleClick = () => {
    dispatch(push('/networth'));
  };

  const textVariant1 = textSize === 'large' ? 'body1' : 'body2';
  const textVariant2 = textSize === 'large' ? 'h6' : 'body1';
  const textVariant3 = textSize === 'large' ? 'h5' : 'h6';

  const justifyContent = align === 'center' ? 'center' : 'flex-start';

  return (
    <Stack direction='column' onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <Typography variant={textVariant1} color='text.secondary' align={align}>
        {title}
      </Typography>
      <BoxFlexCenter sx={{ justifyContent }}>
        <Typography variant={textVariant2} color='text.secondary'>
          $
        </Typography>
        <Typography variant={textVariant3} color='white' fontWeight='bold'>
          {_numberToCurrency.format(networth)}
        </Typography>
      </BoxFlexCenter>
      <BoxFlexCenter sx={{ justifyContent }}>
        {differenceAttrs.symbol && (
          <Typography
            variant={textVariant1}
            color={differenceAttrs.color}
            fontWeight='bold'
          >
            {differenceAttrs.symbol}
          </Typography>
        )}
        <Typography
          variant={textVariant1}
          color={differenceAttrs.color}
          fontWeight='bold'
        >
          $
        </Typography>
        <Typography
          variant={textVariant1}
          color={differenceAttrs.color}
          fontWeight='bold'
        >
          {_numberToCurrency.format(Math.abs(difference))}
        </Typography>
        <Typography
          variant={textVariant1}
          color={differenceAttrs.color}
          fontWeight='bold'
        >
          &nbsp;
        </Typography>
        <Typography
          variant={textVariant1}
          color={differenceAttrs.color}
          fontWeight='bold'
        >
          {`(${percentDifference.toFixed(2)}%)`}
        </Typography>
      </BoxFlexCenter>
    </Stack>
  );
}
