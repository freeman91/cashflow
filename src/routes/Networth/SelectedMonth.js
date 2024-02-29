import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
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
    <Card raised sx={{ width: '100%' }}>
      <CardHeader
        title={
          <Stack direction='row' sx={{ justifyContent: 'space-around' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                width: '25%',
              }}
            >
              <Typography>assets</Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {numberToCurrency.format(assetSum)}
              </Typography>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                width: '25%',
              }}
            >
              <Typography>
                {dayjs(selected.timestamp).format('MMMM YYYY')}
              </Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {numberToCurrency.format(assetSum - debtSum)}
              </Typography>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                width: '25%',
              }}
            >
              <Typography>debts</Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {numberToCurrency.format(debtSum)}
              </Typography>
            </div>
          </Stack>
        }
        disableTypography
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 1, pb: '8px !important' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <MonthTable title='assets' items={assets} />
          <MonthTable title='debts' items={debts} />
        </div>
      </CardContent>
    </Card>
  );
}
