import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import find from 'lodash/find';
import reduce from 'lodash/reduce';

import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import AssetsTable from './AssetsTable';
import AssetPage from './AssetPage';
import PageSelect from '../../components/Selector/PageSelect';
import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';

export default function Assets() {
  const dispatch = useDispatch();
  const location = useLocation();
  const assets = useSelector((state) => state.assets.data);

  const [asset, setAsset] = useState(null);
  const [assetSum, setAssetSum] = useState(0);
  const [id, setId] = useState('');

  useEffect(() => {
    dispatch(
      setAppBar({
        title: 'assets',
        leftAction: <BackButton />,
        rightAction: asset ? (
          <IconButton
            onClick={() =>
              dispatch(
                openDialog({
                  type: 'asset',
                  mode: 'edit',
                  id: asset.asset_id,
                })
              )
            }
          >
            <EditIcon />
          </IconButton>
        ) : (
          <PageSelect />
        ),
      })
    );
  }, [dispatch, asset]);

  useEffect(() => {
    let _pathname = location.pathname;
    let _id = _pathname.replace('/assets', '');
    _id = _id.replace('/', '');
    setId(_id);
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      let _asset = find(assets, { asset_id: id });
      setAsset(_asset);
      setAssetSum(0);
    } else {
      setAsset(null);
      setAssetSum(reduce(assets, (sum, asset) => sum + asset.value, 0));
    }
  }, [assets, id]);

  const renderComponent = () => {
    if (asset) {
      return <AssetPage asset={asset} />;
    }
    return <AssetsTable />;
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{
        pl: 1,
        pr: 1,
        pt: 1,
        mb: 8,
      }}
    >
      {!asset && (
        <Grid item xs={12}>
          <Card raised>
            <CardContent sx={{ p: 1, pt: '4px', pb: '0 !important' }}>
              <Typography
                align='center'
                variant='h4'
                color={(theme) => theme.palette.green[600]}
              >
                {numberToCurrency.format(assetSum)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
      {renderComponent()}
    </Grid>
  );
}
