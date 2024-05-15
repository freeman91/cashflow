import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import dayjs from 'dayjs';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MonthTable from './MonthTable';
import { numberToCurrency } from '../../helpers/currency';

export default function SelectedMonth(props) {
  const { selected } = props;
  const networths = useSelector((state) => state.networths.data);
  const [networth, setNetworth] = useState({});

  const [assets, setAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [debts, setDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    if (selected.id) {
      setNetworth(find(networths, { networth_id: selected.id }));
    } else {
      setNetworth({});
    }
  }, [networths, selected.id]);

  useEffect(() => {
    if (networth.assets) {
      setAssets(sortBy(networth.assets, 'value').reverse());
      setAssetSum(
        reduce(networth.assets, (sum, asset) => sum + asset.value, 0)
      );
    } else {
      setAssetSum(0);
      setAssets([]);
    }
  }, [networth.assets]);

  useEffect(() => {
    if (networth.debts) {
      setDebts(sortBy(networth.debts, 'value').reverse());
      setDebtSum(reduce(networth.debts, (sum, debt) => sum + debt.value, 0));
    } else {
      setDebtSum(0);
      setDebts([]);
    }
  }, [networth.debts]);

  if (!selected.id) return null;

  return (
    <>
      <Stack
        width='100%'
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <Typography variant='h5'>
          {dayjs(selected.timestamp).format('MMMM YYYY')}
        </Typography>
        <Typography variant='h5' sx={{ fontWeight: 800, ml: 4 }}>
          {numberToCurrency.format(assetSum - debtSum)}
        </Typography>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <MonthTable title='assets' items={assets} total={assetSum} />
        <MonthTable title='debts' items={debts} total={debtSum} />
      </div>
    </>
  );
}
