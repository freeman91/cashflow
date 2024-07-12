import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import find from 'lodash/find';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';
import AssetsStack from './AssetsStack';
import AssetPage from './AssetPage';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function Assets() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const assets = useSelector((state) => state.assets.data);

  let assetId = location.pathname.replace('/assets', '');
  assetId = assetId.replace('/', '');
  const [asset, setAsset] = useState(null);
  const [assetSum, setAssetSum] = useState(0);

  useEffect(() => {
    dispatch(
      setAppBar({
        leftAction: <BackButton />,
        rightAction: (
          <Stack spacing={1} direction='row'>
            <Card raised>
              <IconButton onClick={() => dispatch(push('/accounts'))}>
                <AccountBalanceIcon />
              </IconButton>
            </Card>
            <Card raised>
              <IconButton onClick={() => dispatch(push('/debts'))}>
                <CreditCardIcon />
              </IconButton>
            </Card>
          </Stack>
        ),
      })
    );
  }, [dispatch, asset]);

  useEffect(() => {
    if (assetId) {
      let _asset = find(assets, { asset_id: assetId });
      setAsset(_asset);
      setAssetSum(0);
    } else {
      setAsset(null);
      setAssetSum(reduce(assets, (sum, asset) => sum + asset.value, 0));
    }
  }, [assets, assetId]);

  const renderComponent = () => {
    if (asset) {
      return <AssetPage asset={asset} />;
    }
    return <AssetsStack />;
  };

  if (assetId && !asset) return null;
  return (
    <Grid container spacing={1}>
      {!asset && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              background: `linear-gradient(0deg, ${theme.palette.surface[300]}, ${theme.palette.surface[400]})`,
              width: '100%',
              py: 1,
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <BoxFlexCenter>
              <Typography variant='h4' color='grey.10'>
                $
              </Typography>
              <Typography variant='h4' color='white' fontWeight='bold'>
                {_numberToCurrency.format(assetSum)}
              </Typography>
            </BoxFlexCenter>
            <Typography variant='body2' align='center' color='grey.10'>
              asset total
            </Typography>
          </Box>
        </Grid>
      )}
      {renderComponent()}
    </Grid>
  );
}
