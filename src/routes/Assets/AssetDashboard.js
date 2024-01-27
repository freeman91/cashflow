import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { goBack } from 'redux-first-history';
import find from 'lodash/find';
import filter from 'lodash/filter';

import BackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import NewTransactionButton from '../../components/NewTransactionButton';
import { openDialog } from '../../store/dialogs';
import PurchasesTable from './PurchasesTable';
import SalesTable from './SalesTable';

export default function AssetDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();

  const assets = useSelector((state) => state.assets.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);

  const [id, setId] = useState('');
  const [asset, setAsset] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchaseSum, setPurchaseSum] = useState(0);
  const [saleSum, setSaleSum] = useState(0);

  useEffect(() => {
    let _pathname = location.pathname;
    let _id = _pathname.replace('/app/assets', '');
    _id = _id.replace('/', '');
    setId(_id);
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      let _purchases = filter(allPurchases, { asset_id: id });
      setPurchases(_purchases);

      let _sales = filter(allSales, { asset_id: id });
      setSales(_sales);

      setAsset(find(assets, { asset_id: id }));
    } else {
      setAsset({});
    }
  }, [id, allPurchases, allSales, assets]);

  useEffect(() => {
    setPurchaseSum(purchases.reduce((acc, curr) => acc + curr.amount, 0));
  }, [purchases]);

  useEffect(() => {
    setSaleSum(sales.reduce((acc, curr) => acc + curr.value, 0));
  }, [sales]);

  if (!id) return null;

  return (
    <>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: 700 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '66%',
          }}
        >
          <Tooltip title='back' placement='left'>
            <IconButton color='primary' onClick={() => dispatch(goBack())}>
              <BackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant='h4' align='center' sx={{ width: '100%' }}>
            {asset?.name}
          </Typography>
          <Tooltip title='edit' placement='right'>
            <IconButton
              color='primary'
              onClick={() =>
                dispatch(
                  openDialog({
                    type: asset?._type,
                    mode: 'edit',
                    id: asset?.asset_id,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%',
          }}
        >
          <Typography variant='h6' align='left' sx={{ width: '100%' }}>
            value
          </Typography>
          <Typography variant='h6' align='right' sx={{ width: '100%' }}>
            {numberToCurrency.format(asset.value)}
          </Typography>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%',
          }}
        >
          <Typography variant='h6' align='left' sx={{ width: '100%' }}>
            invested
          </Typography>
          <Typography variant='h6' align='right' sx={{ width: '100%' }}>
            {numberToCurrency.format(purchaseSum - saleSum)}
          </Typography>
        </div>

        {purchases.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
        {purchases.length > 0 && (
          <Typography sx={{ width: '100%' }} align='left'>
            purchases
          </Typography>
        )}
        {purchases.length > 0 && <PurchasesTable assetId={id} />}

        {sales.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
        {sales.length > 0 && (
          <Typography sx={{ width: '100%' }} align='left'>
            sales
          </Typography>
        )}
        {sales.length > 0 && <SalesTable assetId={id} />}
      </Stack>
      <NewTransactionButton transactionTypes={['purchase', 'sale']} />
    </>
  );
}
